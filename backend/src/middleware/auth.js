const jwt = require("jsonwebtoken")
const { getRepository } = require("typeorm")
const User = require("../entities/User")

// Middleware para verificar el token JWT
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    console.log("No se proporcionó Authorization header")
    return res.status(401).json({ message: "No se proporcionó token de autenticación" })
  }

  const parts = authHeader.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log("Formato de token inválido:", authHeader)
    return res.status(401).json({ message: "Formato de token inválido" })
  }

  const token = parts[1]

  try {
    console.log(`Verificando token: ${token.substring(0, 15)}...`)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("Token verificado correctamente. Usuario:", decoded.username, "ID:", decoded.id)
    
    // Verificar si el usuario está verificado
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ where: { id: decoded.id } })
    
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" })
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: "Debes verificar tu correo electrónico antes de acceder",
        requiresVerification: true,
        email: user.email
      })
    }
    
    req.user = decoded
    next()
  } catch (error) {
    console.error("Error al verificar token:", error.message)
    return res.status(401).json({ message: "Token inválido o expirado" })
  }
}

// Middleware para verificar roles
exports.checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "No tienes permiso para acceder a este recurso" })
    }

    next()
  }
}
