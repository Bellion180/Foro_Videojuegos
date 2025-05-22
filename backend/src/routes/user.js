const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { verifyToken, checkRole } = require("../middleware/auth")
const upload = require("../middleware/upload")

// Rutas públicas
router.get("/:id", userController.getUserById)

// Rutas protegidas (requieren autenticación)
router.put("/:id", verifyToken, upload.single('avatar'), userController.updateUser)
router.put("/:id/password", verifyToken, userController.changePassword)
router.delete("/:id", verifyToken, userController.deleteUser)
router.get("/:id/stats", userController.getUserStats)

// Rutas para administradores
router.get("/", verifyToken, checkRole(["admin"]), userController.getAllUsers)

module.exports = router
