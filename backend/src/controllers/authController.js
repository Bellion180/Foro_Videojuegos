const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { getRepository } = require("typeorm")
const User = require("../entities/User")
const crypto = require("crypto")

// Almacén de refresh tokens (en producción debe ser una base de datos)
// formato: { userId: { token: string, expiresAt: Date } }
const refreshTokenStore = {}

// Función auxiliar para generar refresh tokens
const generateRefreshToken = (userId) => {
  const refreshToken = crypto.randomBytes(40).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30) // 30 días de validez
  
  refreshTokenStore[userId] = {
    token: refreshToken,
    expiresAt
  }
  
  return refreshToken
}

// Función auxiliar para generar el token JWT
const generateJwtToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

// Función para verificar un refresh token
const verifyRefreshToken = (userId, token) => {
  const storedData = refreshTokenStore[userId]
  
  if (!storedData) {
    return false
  }
  
  if (storedData.token !== token) {
    return false
  }
  
  if (new Date() > storedData.expiresAt) {
    delete refreshTokenStore[userId]
    return false
  }
  
  return true
}

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const userRepository = getRepository(User)
    const { username, email, password } = req.body

    // Verificar si el usuario ya existe
    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    })

    if (existingUser) {
      return res.status(400).json({ message: "El usuario o email ya está en uso" })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el nuevo usuario
    const newUser = userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: "user",
    })

    await userRepository.save(newUser)

    // Generar token JWT
    const token = generateJwtToken(newUser)
    
    // Generar refresh token
    const refreshToken = generateRefreshToken(newUser.id)

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword,
      token,
      refreshToken
    })
  } catch (error) {
    console.error("Error en el registro:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Inicio de sesión
exports.login = async (req, res) => {
  try {
    const userRepository = getRepository(User)
    const { email, password } = req.body

    // Buscar el usuario por email
    const user = await userRepository.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciales inválidas" })
    }

    // Generar token JWT
    const token = generateJwtToken(user)
    
    // Generar refresh token
    const refreshToken = generateRefreshToken(user.id)

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: userWithoutPassword,
      token,
      refreshToken
    })
  } catch (error) {
    console.error("Error en el inicio de sesión:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Obtener perfil del usuario
exports.getProfile = async (req, res) => {
  try {
    const userRepository = getRepository(User)
    const userId = req.user.id

    const user = await userRepository.findOne({
      where: { id: userId },
      select: ["id", "username", "email", "avatar", "bio", "joinDate", "role"],
    })

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.error("Error al obtener el perfil:", error)
    res.status(500).json({ message: "Error en el servidor" })
  }
}

// Refrescar token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token no proporcionado" })
    }
    
    // Decodificar el token actual para obtener el ID de usuario
    // Esto puede fallar si el token está completamente malformado, pero nos permite
    // refrescar incluso tokens expirados
    let userId = null
    try {
      const oldToken = req.headers.authorization?.split(' ')[1]
      if (oldToken) {
        const decoded = jwt.decode(oldToken)
        if (decoded && decoded.id) {
          userId = decoded.id
        }
      }
    } catch (e) {
      console.error("Error al decodificar token antiguo:", e)
    }
    
    // Si no pudimos obtener el userId del token, buscar en todos los refresh tokens
    if (!userId) {
      // Buscar el userId que corresponde a este refresh token
      userId = Object.keys(refreshTokenStore).find(id => 
        refreshTokenStore[id] && refreshTokenStore[id].token === refreshToken
      )
      
      if (!userId) {
        return res.status(401).json({ message: "Refresh token inválido" })
      }
    }
    
    // Verificar el refresh token
    if (!verifyRefreshToken(userId, refreshToken)) {
      return res.status(401).json({ message: "Refresh token expirado o inválido" })
    }
    
    // Obtener los datos del usuario
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({
      where: { id: userId },
      select: ["id", "username", "email", "avatar", "bio", "joinDate", "role"],
    })
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }
    
    // Generar nuevo token JWT
    const newToken = generateJwtToken(user)
    
    // Generar nuevo refresh token
    const newRefreshToken = generateRefreshToken(user.id)
    
    return res.status(200).json({
      message: "Token refrescado exitosamente",
      token: newToken,
      refreshToken: newRefreshToken,
      user
    })
  } catch (error) {
    console.error("Error al refrescar token:", error)
    return res.status(500).json({ message: "Error en el servidor" })
  }
}
