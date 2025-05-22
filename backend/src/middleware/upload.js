const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Definir la carpeta donde se guardarán los avatares
const uploadDir = path.join(__dirname, '../../public/uploads/avatars');

// Asegurarse de que el directorio existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar el almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar un nombre único basado en el timestamp y un random string
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

// Función para filtrar los archivos (solo permite imágenes)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  
  cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
