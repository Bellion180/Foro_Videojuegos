const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const { createConnection } = require("typeorm")
const routes = require("./routes")
const dbConfig = require("./config/database")

// Cargar variables de entorno
dotenv.config()

// Crear la aplicación Express
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(
  cors({
    origin: "http://localhost:4200", // Reemplaza con la URL de tu frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())

// Rutas
app.use("/api", routes)

// Conectar a la base de datos y luego iniciar el servidor
createConnection(dbConfig)
  .then(() => {
    console.log("Conexión a la base de datos establecida")
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error)
  })
