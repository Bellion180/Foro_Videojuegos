const express = require("express")
const router = express.Router()
const authRoutes = require("./auth")
const forumRoutes = require("./forum")
const threadRoutes = require("./thread")
const postRoutes = require("./post")
const userRoutes = require("./user")

router.use("/auth", authRoutes)
router.use("/forums", forumRoutes)
router.use("/threads", threadRoutes)
router.use("/posts", postRoutes)
router.use("/users", userRoutes)

module.exports = router
