import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    // Crear conexión usando las variables de entorno
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '12345',
      database: process.env.DB_DATABASE || 'gaming_forum'
    });

    console.log('✅ Conexión a la base de datos establecida correctamente');

    // Probar consultas básicas para verificar los datos
    const [userCount] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`👤 Usuarios en la base de datos: ${userCount[0].count}`);

    const [forumCount] = await connection.execute('SELECT COUNT(*) as count FROM forums');
    console.log(`📋 Foros en la base de datos: ${forumCount[0].count}`);

    const [threadCount] = await connection.execute('SELECT COUNT(*) as count FROM threads');
    console.log(`📝 Hilos en la base de datos: ${threadCount[0].count}`);

    const [postCount] = await connection.execute('SELECT COUNT(*) as count FROM posts');
    console.log(`💬 Publicaciones en la base de datos: ${postCount[0].count}`);

    // Cerrar la conexión
    await connection.end();
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error);
  }
}

testConnection();