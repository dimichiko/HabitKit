require('dotenv').config();
const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/habitkit');

// Schema de usuario (simplificado para debug)
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  isEmailVerified: Boolean,
  createdAt: Date
});

const User = mongoose.model('User', userSchema);

async function debugToken(token) {
  console.log('🔍 Debuggeando token:', token);
  console.log('📅 Fecha actual:', new Date());
  
  try {
    // Buscar usuario con este token
    const user = await User.findOne({ emailVerificationToken: token });
    
    if (user) {
      console.log('✅ Usuario encontrado con este token:');
      console.log('   Email:', user.email);
      console.log('   Nombre:', user.name);
      console.log('   Token:', user.emailVerificationToken);
      console.log('   Expira:', user.emailVerificationExpires);
      console.log('   Verificado:', user.isEmailVerified);
      console.log('   Creado:', user.createdAt);
      
      // Verificar si expiró
      const now = new Date();
      const isExpired = user.emailVerificationExpires < now;
      console.log('   ¿Expiró?:', isExpired ? 'Sí' : 'No');
      
      if (isExpired) {
        console.log('   ⏰ Token expirado hace:', now - user.emailVerificationExpires, 'ms');
      }
      
    } else {
      console.log('❌ No se encontró usuario con este token');
      
      // Buscar todos los usuarios con tokens para debug
      const usersWithTokens = await User.find({ 
        emailVerificationToken: { $exists: true, $ne: null } 
      });
      
      console.log('\n📋 Usuarios con tokens activos:');
      usersWithTokens.forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.email} - Token: ${u.emailVerificationToken}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

async function listAllUsers() {
  console.log('📋 Listando todos los usuarios...');
  
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).limit(10);
    
    users.forEach((user, i) => {
      console.log(`\n${i + 1}. ${user.email}`);
      console.log('   Nombre:', user.name);
      console.log('   Verificado:', user.isEmailVerified);
      console.log('   Token:', user.emailVerificationToken || 'No');
      console.log('   Expira:', user.emailVerificationExpires);
      console.log('   Creado:', user.createdAt);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Función principal
async function main() {
  const token = process.argv[2];
  
  if (token) {
    await debugToken(token);
  } else {
    await listAllUsers();
  }
}

main(); 