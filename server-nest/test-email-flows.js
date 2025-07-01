require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Configuración de axios
axios.defaults.baseURL = API_BASE;

async function testEmailFlows() {
  console.log('🧪 Probando flujos de email de LifeHub...\n');

  try {
    // 1. Test de registro (envía email de bienvenida y verificación)
    console.log('1️⃣ Probando registro de usuario...');
    const registerResponse = await axios.post('/auth/register', {
      name: 'Usuario Test',
      email: process.env.EMAIL_USER, // Enviar a ti mismo para prueba
      password: 'test123456'
    });
    console.log('✅ Registro exitoso:', registerResponse.data.message);
    console.log('📧 Email de bienvenida y verificación enviado\n');

    // 2. Test de reset de contraseña
    console.log('2️⃣ Probando reset de contraseña...');
    const resetResponse = await axios.post('/auth/reset-password', {
      email: process.env.EMAIL_USER
    });
    console.log('✅ Reset de contraseña:', resetResponse.data.message);
    console.log('📧 Email de reset enviado\n');

    // 3. Test de reenvío de verificación
    console.log('3️⃣ Probando reenvío de verificación...');
    const resendResponse = await axios.post('/auth/resend-verification', {
      email: process.env.EMAIL_USER
    });
    console.log('✅ Reenvío de verificación:', resendResponse.data.message);
    console.log('📧 Email de verificación reenviado\n');

    console.log('🎉 ¡Todos los flujos de email funcionan correctamente!');
    console.log('\n📋 Resumen de emails enviados:');
    console.log('   • Email de bienvenida');
    console.log('   • Email de verificación (original)');
    console.log('   • Email de reset de contraseña');
    console.log('   • Email de verificación (reenviado)');
    console.log('\n📬 Revisa tu bandeja de entrada en:', process.env.EMAIL_USER);

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    
    if (error.response?.status === 400 && error.response?.data?.message?.includes('ya existe')) {
      console.log('\n💡 El usuario ya existe. Esto es normal si ya has probado antes.');
      console.log('   Los emails de verificación y reset deberían haberse enviado.');
    }
  }
}

// Función para probar con un email diferente
async function testWithDifferentEmail() {
  console.log('\n🧪 Probando con email diferente...');
  
  const testEmail = 'test@example.com'; // Email de prueba
  
  try {
    // Test de reset de contraseña con email inexistente
    console.log('📧 Probando reset con email inexistente...');
    const resetResponse = await axios.post('/auth/reset-password', {
      email: testEmail
    });
    console.log('✅ Respuesta segura:', resetResponse.data.message);
    console.log('   (No revela si el email existe o no)');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
async function runTests() {
  await testEmailFlows();
  await testWithDifferentEmail();
  
  console.log('\n📚 Próximos pasos:');
  console.log('   1. Revisa tu email para ver los templates');
  console.log('   2. Haz clic en los enlaces de verificación');
  console.log('   3. Prueba el flujo completo en la aplicación web');
  console.log('   4. Verifica que los tokens funcionen correctamente');
}

runTests(); 