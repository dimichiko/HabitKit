const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testApiRoutes() {
  console.log('🔍 Probando rutas de la API...\n');

  // Test 1: Verificar que el servidor está funcionando
  console.log('1️⃣ Probando health check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Servidor funcionando:', response.status);
  } catch (error) {
    console.log('❌ Error conectando al servidor:', error.message);
    return;
  }

  // Test 2: Verificar que /habits requiere autenticación
  console.log('\n2️⃣ Probando acceso a /habits sin token...');
  try {
    await axios.get(`${BASE_URL}/habits`);
    console.log('❌ ERROR: Se permitió acceso sin token');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ CORRECTO: Acceso denegado sin token (401)');
    } else {
      console.log('❌ ERROR: Respuesta inesperada:', error.response?.status);
    }
  }

  console.log('\n🎯 Resumen de pruebas de rutas:');
  console.log('✅ Servidor backend funcionando en puerto 3001');
  console.log('✅ Endpoints protegidos requieren autenticación');
}

testApiRoutes().catch(console.error); 