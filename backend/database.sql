-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS gaming_forum;
USE gaming_forum;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  joinDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role VARCHAR(20) DEFAULT 'user'
);

-- Tabla de foros
CREATE TABLE IF NOT EXISTS forums (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de hilos
CREATE TABLE IF NOT EXISTS threads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  authorId INT NOT NULL,
  forumId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  viewCount INT DEFAULT 0,
  isPinned BOOLEAN DEFAULT FALSE,
  isLocked BOOLEAN DEFAULT FALSE,
  tags JSON,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (forumId) REFERENCES forums(id) ON DELETE CASCADE
);

-- Tabla de publicaciones
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL,
  authorId INT NOT NULL,
  threadId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  isEdited BOOLEAN DEFAULT FALSE,
  likes INT DEFAULT 0,
  isAcceptedAnswer BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (threadId) REFERENCES threads(id) ON DELETE CASCADE
);

-- Insertar datos de ejemplo
-- Usuarios
INSERT INTO users (username, email, password, role, bio) VALUES
('admin', 'admin@example.com', '$2b$10$XJrS7/6QsIRJt.mTHJZL8.HT.R3b7rvKYiE0z3nUcZL.nQlKIvRXe', 'admin', 'Administrador del foro'),
('user1', 'user1@example.com', '$2b$10$XJrS7/6QsIRJt.mTHJZL8.HT.R3b7rvKYiE0z3nUcZL.nQlKIvRXe', 'user', 'Usuario regular del foro'),
('user2', 'user2@example.com', '$2b$10$XJrS7/6QsIRJt.mTHJZL8.HT.R3b7rvKYiE0z3nUcZL.nQlKIvRXe', 'user', 'Otro usuario del foro'),
('moderator', 'moderator@example.com', '$2b$10$XJrS7/6QsIRJt.mTHJZL8.HT.R3b7rvKYiE0z3nUcZL.nQlKIvRXe', 'moderator', 'Moderador del foro');

-- Foros
INSERT INTO forums (name, description, icon) VALUES
('Action Games', 'Discuss the latest action games, share tips and strategies.', 'A'),
('RPG Discussion', 'For fans of role-playing games, both western and JRPGs.', 'R'),
('Strategy Games', 'RTS, turn-based, and all other strategy game discussions.', 'S'),
('Indie Games', 'Discover and discuss indie game gems and upcoming releases.', 'I'),
('Gaming News', 'The latest news, announcements, and industry updates.', 'N');

-- Hilos
INSERT INTO threads (title, content, authorId, forumId, viewCount, isPinned, tags) VALUES
('Best RPG games of 2024', '<p>What are your favorite RPG games released this year? I\'ve been playing Elden Ring and it\'s amazing!</p>', 2, 2, 120, TRUE, '["rpg", "elden ring", "2024"]'),
('Strategy game recommendations', '<p>I\'m looking for new strategy games to play. Any recommendations?</p>', 3, 3, 85, FALSE, '["strategy", "recommendations"]'),
('Upcoming Nintendo Switch Games', '<p>What Nintendo Switch games are you looking forward to in the coming months?</p>', 4, 5, 210, FALSE, '["nintendo", "switch", "upcoming"]');

-- Publicaciones
INSERT INTO posts (content, authorId, threadId, likes, isAcceptedAnswer) VALUES
('<p>I\'ve been playing Baldur\'s Gate 3 and it\'s definitely my GOTY!</p>', 3, 1, 15, FALSE),
('<p>I recommend Civilization VI if you like turn-based strategy games.</p>', 2, 2, 8, TRUE),
('<p>Age of Empires 4 is also a great choice for RTS fans.</p>', 4, 2, 12, FALSE),
('<p>I\'m really excited for the new Zelda game!</p>', 2, 3, 20, FALSE);
