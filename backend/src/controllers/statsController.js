// This file will contain the code for the stats controller
const { getRepository } = require("typeorm");
const User = require("../entities/User");
const Thread = require("../entities/Thread");
const Post = require("../entities/Post");

// Function to get site-wide statistics
exports.getSiteStats = async (req, res) => {
  try {
    // Get count of all users
    const userRepository = getRepository(User);
    const userCount = await userRepository.count();

    // Get count of all threads
    const threadRepository = getRepository(Thread);
    const threadCount = await threadRepository.count();

    // Get count of all posts
    const postRepository = getRepository(Post);
    const postCount = await postRepository.count();

    // Get count of online users - this is usually done via a cache/session system
    // For now, we'll use a placeholder approximation (10% of total users)
    const onlineUsers = Math.max(1, Math.floor(userCount * 0.1));

    // Return all statistics
    res.status(200).json({
      userCount,
      threadCount,
      postCount,
      onlineUsers
    });
  } catch (error) {
    console.error("Error al obtener estadísticas del sitio:", error);
    res.status(500).json({ message: "Error al obtener estadísticas del sitio" });
  }
};
