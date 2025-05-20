const dotenv = require("dotenv")

dotenv.config()

module.exports = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // En producción, esto debería ser false
  logging: false,
  entities: [
    require("../entities/User"),
    require("../entities/Forum"),
    require("../entities/Thread"),
    require("../entities/Post"),
  ],
}
