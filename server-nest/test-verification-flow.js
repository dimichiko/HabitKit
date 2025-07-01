require('dotenv').config();
const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

// Configuración de axios
axios.defaults.baseURL = API_BASE;

async function testVerificationFlow() {
  console.log('🧪 Probando flujo completo de verificación...\n');

  try {
    // 1. Registrar un nuevo usuario
    console.log('1️⃣ Registrando usuario de prueba...');
    const testEmail = `test-${Date.now()}@example.com`;
    const registerResponse = await axios.post('/auth/register', {
      name: 'Usuario Test Verificación',
      email: testEmail,
      password: 'test123456'
    });
    
    console.log('✅ Registro exitoso');
    console.log('📧 Email:', testEmail);
    console.log('📝 Respuesta:', registerResponse.data);
    
    // 2. Buscar el usuario en la base de datos para obtener el token
    console.log('\n2️⃣ Buscando usuario en base de datos...');
    
    // Nota: En un entorno real, necesitarías acceso directo a la base de datos
    // Por ahora, vamos a simular el proceso
    
    console.log('💡 Para obtener el token real, revisa los logs del servidor');
    console.log('   o revisa el email enviado a:', testEmail);
    
    // 3. Simular verificación con un token de ejemplo
    console.log('\n3️⃣ Simulando verificación...');
    console.log('💡 Reemplaza TOKEN_AQUI con el token real del email o logs');
    
    const testToken = 'TOKEN_AQUI'; // Reemplazar con token real
    
    if (testToken !== 'TOKEN_AQUI') {
      const verifyResponse = await axios.post('/auth/verify-email', { 
        token: testToken 
      });
      console.log('✅ Verificación exitosa:', verifyResponse.data);
    } else {
      console.log('⏭️ Saltando verificación (token no configurado)');
    }
    
    // 4. Probar login después de verificación
    console.log('\n4️⃣ Probando login...');
    try {
      const loginResponse = await axios.post('/auth/login', {
        email: testEmail,
        password: 'test123456'
      });
      console.log('✅ Login exitoso:', loginResponse.data.user.email);
    } catch (loginError) {
      console.log('❌ Login falló (esperado si no se verificó):', loginError.response?.data?.message);
    }
    
  } catch (error) {
    console.error('❌ Error en el flujo:', error.response?.data || error.message);
  }
}

async function debugToken(token) {
  console.log('\n🔍 Debuggeando token específico...');
  console.log('Token:', token);
  
  try {
    const response = await axios.post('/auth/verify-email', { token });
    console.log('✅ Verificación exitosa:', response.data);
  } catch (error) {
    console.log('❌ Error de verificación:', error.response?.data);
  }
}

// Función principal
async function main() {
  await testVerificationFlow();
  
  console.log('\n📋 Instrucciones para debuggear:');
  console.log('1. Ejecuta este script para crear un usuario de prueba');
  console.log('2. Revisa los logs del servidor para ver el token generado');
  console.log('3. Revisa el email enviado para obtener el enlace de verificación');
  console.log('4. Usa debugToken() para probar un token específico');
  console.log('5. Verifica que el token en el email coincida con el de la base de datos');
  
  // Si se proporciona un token como argumento, debuggearlo
  const token = process.argv[2];
  if (token) {
    await debugToken(token);
  }
}

main(); 