const jwt = require("jsonwebtoken")

// Middleware para verificar el token JWT
exports.verifyToken = (req, res, next) => {
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
