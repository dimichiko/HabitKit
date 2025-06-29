# CalorieKit - Control de Nutrición y Calorías

CalorieKit es una aplicación completa para el seguimiento nutricional que permite registrar comidas, calcular calorías y analizar el progreso nutricional.

## 🚀 Características Principales

### 📝 Registro de Comidas
- **Búsqueda de alimentos** con base de datos USDA (300,000+ alimentos)
- **Alimentos personalizados** con valores nutricionales
- **Porciones personalizables** para cada alimento
- **Categorización** por tipo de comida (Desayuno, Almuerzo, Cena, Snack)

### 📊 Seguimiento Diario
- **Contador de calorías** con progreso visual
- **Desglose de macronutrientes** (proteínas, carbohidratos, grasas)
- **Control de agua** con botones rápidos
- **Registro de ejercicio** para calcular déficit/superávit

### 🎯 Metas y Objetivos
- **Meta de calorías diarias** configurable
- **Cálculo automático** de necesidades calóricas
- **Progreso visual** con colores según cumplimiento

### 📈 Analytics
- **Gráficos de progreso** semanal/mensual
- **Distribución de macronutrientes**
- **Tendencias de calorías** por día
- **Estadísticas de cumplimiento**

## 🔧 Configuración de USDA API

Para usar la base de datos completa de USDA (recomendado):

### 1. Obtener API Key Gratuita
1. Ve a: https://fdc.nal.usda.gov/api-key-signup.html
2. Regístrate con tu email
3. Recibirás tu API key gratuita por email

### 2. Configurar API Key
1. Abre el archivo: `client/src/apps/caloriekit/config.js`
2. Reemplaza `'DEMO_KEY'` con tu API key real:
```javascript
export const USDA_CONFIG = {
  API_KEY: 'TU_API_KEY_AQUI', // Reemplaza con tu API key real
  // ... resto de configuración
};
```

### 3. Límites de la API Gratuita
- **3,600 requests por día**
- **Búsquedas ilimitadas** de alimentos
- **Datos nutricionales precisos**
- **Marcas comerciales incluidas**

## 📁 Estructura del Proyecto

```
caloriekit/
├── components/
│   ├── FoodSearch.js      # Buscador con API USDA
│   ├── MealEntry.js       # Registro de comidas
│   ├── DailySummary.js    # Resumen diario
│   └── NutritionChart.js  # Gráficos nutricionales
├── screens/
│   ├── CalorieKitApp.js   # App principal
│   ├── FoodLogPage.js     # Página de registro
│   └── AnalyticsPage.js   # Página de analytics
├── utils/
│   ├── api.js             # API USDA + localStorage
│   └── nutritionCalculator.js # Cálculos nutricionales
├── config.js              # Configuración centralizada
└── README.md              # Este archivo
```

## 🎨 Características Técnicas

### Base de Datos
- **USDA Food Database** (300,000+ alimentos)
- **Fallback local** (15 alimentos básicos)
- **Cache inteligente** para búsquedas frecuentes
- **Manejo de errores** robusto

### Persistencia
- **localStorage** para datos locales
- **Cache de búsquedas** para mejor rendimiento
- **Datos por fecha** para seguimiento histórico

### UI/UX
- **Diseño responsive** para móvil y desktop
- **Tema naranja/rojo** distintivo
- **Estados de carga** informativos
- **Estados vacíos** útiles

## 🔄 Flujo de Datos

1. **Búsqueda**: Usuario busca alimento → API USDA → Resultados filtrados
2. **Selección**: Usuario selecciona alimento → Se agrega a la comida
3. **Registro**: Comida se guarda en localStorage → Se actualiza resumen
4. **Analytics**: Datos se procesan → Gráficos y estadísticas

## 🛠️ Desarrollo

### Instalación
```bash
# No requiere dependencias adicionales
# Solo React y Tailwind CSS (ya incluidos)
```

### Configuración de Desarrollo
1. Obtén tu API key de USDA
2. Actualiza `config.js` con tu API key
3. Inicia la aplicación
4. Prueba la búsqueda de alimentos

### Variables de Entorno (Opcional)
Puedes usar variables de entorno para la API key:
```javascript
// En config.js
export const USDA_CONFIG = {
  API_KEY: process.env.REACT_APP_USDA_API_KEY || 'DEMO_KEY',
  // ...
};
```

## 🚨 Solución de Problemas

### Error de API
- Verifica que tu API key sea válida
- Revisa los límites de uso (3,600 requests/día)
- La app fallback automáticamente a la base local

### Sin Resultados de Búsqueda
- Intenta términos más específicos
- Verifica la conexión a internet
- La app usa la base local como respaldo

### Datos Incorrectos
- Los datos de USDA son los más precisos disponibles
- Para alimentos personalizados, usa la opción "Alimento personalizado"

## 📱 Uso

1. **Accede** desde el selector de apps de LifeHub
2. **Busca** alimentos en la base de datos USDA
3. **Registra** tus comidas por tipo
4. **Revisa** tu progreso diario
5. **Analiza** tus tendencias en la pestaña Analytics

## 🔮 Próximas Mejoras

- [ ] Escáner de códigos de barras
- [ ] Alimentos favoritos
- [ ] Recetas personalizadas
- [ ] Sincronización en la nube
- [ ] Notificaciones de recordatorio
- [ ] Exportación de datos

---

**CalorieKit** - Tu compañero nutricional inteligente 🍎 