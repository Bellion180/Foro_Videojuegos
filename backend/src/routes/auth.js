const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { verifyToken } = require("../middleware/auth")

// Rutas públicas
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/refresh-token", authController.refreshToken)

// Rutas protegidas
router.get("/profile", verifyToken, authController.getProfile)

module.exports = router
