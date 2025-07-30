# Pantalla de Carga - Loading Screen

## Descripción
Este módulo implementa una pantalla de carga atractiva y visual que se muestra antes de que aparezca la web principal. La pantalla incluye animaciones fluidas, efectos visuales modernos y una barra de progreso real que carga los recursos de la aplicación.

## Características

### 🎨 Diseño Visual
- **Logo animado**: Círculo pulsante con las iniciales "EM"
- **Barra de progreso**: Con efecto shimmer y porcentaje real
- **Partículas flotantes**: Efecto de partículas que suben desde abajo
- **Puntos de carga**: Animación de tres puntos que se animan secuencialmente
- **Fondo degradado**: Gradiente oscuro que coincide con el tema de la web

### ⚡ Funcionalidad
- **Carga real de recursos**: Carga todas las imágenes del portfolio
- **Progreso en tiempo real**: Muestra el porcentaje exacto de carga
- **Transición suave**: Fade-out elegante al completar la carga
- **Responsive**: Se adapta perfectamente a todos los dispositivos

### 🎯 Integración
- **Evento personalizado**: Dispara `loadingComplete` cuando termina
- **Integración automática**: Se integra automáticamente con `main.js`
- **Sin conflictos**: No interfiere con las animaciones existentes

## Estructura de Archivos

```
js/loading/
├── loadingScreen.js    # Clase principal de la pantalla de carga
└── README.md          # Esta documentación
```

## Uso

### Inicialización Automática
La pantalla de carga se inicializa automáticamente cuando se carga `main.js`:

```javascript
// En main.js
initLoadingScreen();
```

### Evento de Carga Completa
Escucha el evento cuando la carga ha terminado:

```javascript
document.addEventListener('loadingComplete', () => {
    // Tu código aquí - la web está lista
    console.log('¡Carga completada!');
});
```

## Personalización

### Modificar Recursos a Cargar
Edita el array `resources` en el método `startLoading()`:

```javascript
const resources = [
    'assets/imagen1.png',
    'assets/imagen2.png',
    // Agrega más recursos aquí
];
```

### Cambiar Colores
Modifica las variables CSS en el método `addStyles()`:

```javascript
// Color principal
background: linear-gradient(135deg, #ff6b33, #ff8f6b);

// Color de fondo
background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
```

### Ajustar Animaciones
Modifica las duraciones en las keyframes CSS:

```css
@keyframes logoPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}
```

## Responsive Design

### Desktop (>1024px)
- Logo: 120px
- Barra de progreso: 300px
- Partículas: 25 elementos

### Tablet (768px - 1024px)
- Logo: 100px
- Barra de progreso: 250px
- Partículas: 20 elementos

### Mobile (<768px)
- Logo: 80px
- Barra de progreso: 200px
- Partículas: 15 elementos

## Rendimiento

### Optimizaciones Implementadas
- **Carga paralela**: Los recursos se cargan simultáneamente
- **Animaciones optimizadas**: Uso de `transform` y `opacity`
- **Limpieza automática**: Se elimina del DOM al completar
- **Event listeners pasivos**: Para mejor rendimiento

### Métricas de Rendimiento
- **Tiempo de carga**: ~2-4 segundos (dependiendo de la conexión)
- **Memoria**: Uso mínimo, se limpia automáticamente
- **CPU**: Animaciones optimizadas con GPU

## Troubleshooting

### La pantalla no aparece
1. Verifica que `loadingScreen.js` esté en la ruta correcta
2. Revisa la consola del navegador para errores
3. Asegúrate de que `main.js` se cargue correctamente

### La carga se queda al 0%
1. Verifica que las rutas de las imágenes sean correctas
2. Comprueba que los archivos existan en `assets/`
3. Revisa la conectividad de red

### Animaciones lentas
1. Verifica el rendimiento del dispositivo
2. Reduce el número de partículas si es necesario
3. Comprueba que no haya otros scripts pesados ejecutándose

## Compatibilidad

### Navegadores Soportados
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### Dispositivos
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile
- ✅ Touch devices

## Licencia
Este módulo es parte del portfolio de Emilio Mochón y está diseñado específicamente para este proyecto. 