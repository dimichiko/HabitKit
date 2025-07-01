require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuración del transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Función para probar el envío de email
async function testEmail() {
  try {
    console.log('🚀 Iniciando prueba de email...');
    console.log('📧 Configuración:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.EMAIL_USER,
    });

    // Verificar configuración
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Error: EMAIL_USER y EMAIL_PASS deben estar configurados en .env');
      process.exit(1);
    }

    // Email de prueba
    const mailOptions = {
      from: `"LifeHub Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Enviar a ti mismo para prueba
      subject: '🧪 Prueba de Email - LifeHub',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Prueba de Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🧪 Prueba de Email</h1>
              <p>Sistema de emails de LifeHub</p>
            </div>
            <div class="content">
              <div class="success">
                <strong>✅ ¡Éxito!</strong> El sistema de emails está funcionando correctamente.
              </div>
              <h2>Configuración actual:</h2>
              <ul>
                <li><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</li>
                <li><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</li>
                <li><strong>Email:</strong> ${process.env.EMAIL_USER}</li>
                <li><strong>Frontend URL:</strong> ${process.env.FRONTEND_URL}</li>
              </ul>
              <p>Si recibes este email, significa que el sistema de emails está configurado correctamente y listo para producción.</p>
              <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Prueba de Email - LifeHub
        
        ✅ ¡Éxito! El sistema de emails está funcionando correctamente.
        
        Configuración actual:
        - SMTP Host: ${process.env.SMTP_HOST}
        - SMTP Port: ${process.env.SMTP_PORT}
        - Email: ${process.env.EMAIL_USER}
        - Frontend URL: ${process.env.FRONTEND_URL}
        
        Si recibes este email, significa que el sistema de emails está configurado correctamente.
        
        Timestamp: ${new Date().toLocaleString()}
      `
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email enviado exitosamente!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 Revisa tu bandeja de entrada en:', process.env.EMAIL_USER);
    
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Error de autenticación:');
      console.error('- Verifica que EMAIL_USER y EMAIL_PASS sean correctos');
      console.error('- Si usas Gmail, asegúrate de usar una "Contraseña de aplicación"');
      console.error('- Habilita la verificación en 2 pasos y genera una contraseña de app');
    }
    
    if (error.code === 'ECONNECTION') {
      console.error('\n🌐 Error de conexión:');
      console.error('- Verifica que SMTP_HOST y SMTP_PORT sean correctos');
      console.error('- Verifica tu conexión a internet');
    }
    
    process.exit(1);
  }
}

// Ejecutar prueba
testEmail(); 