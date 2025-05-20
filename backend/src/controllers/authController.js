const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { getRepository } = require("typeorm")
const User = require("../entities/User")

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
    const token = jwt.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...userWithoutPassword } = newUser

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      user: userWithoutPassword,
      token,
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
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    // Eliminar la contraseña del objeto de respuesta
    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: userWithoutPassword,
      token,
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
