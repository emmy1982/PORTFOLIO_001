# 📧 Configuración de EmailJS para el Formulario de Contacto

## 🚀 Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita (permite 200 emails/mes)
3. Verifica tu email

### 2. Configurar el servicio de email
1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona **"Gmail"** (recomendado) u otro proveedor
4. Configura con el email: `emmyjose82@hotmail.com`
5. Anota el **Service ID** que se genera

### 3. Crear template de email
1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Usa este template:

```
Asunto: Nuevo mensaje desde Portfolio - {{from_name}}

Hola Emilio,

Has recibido un nuevo mensaje desde tu portfolio:

Nombre: {{from_name}}
Email: {{from_email}}
Mensaje: {{message}}

---
Este email fue enviado automáticamente desde tu formulario de contacto.
```

4. Anota el **Template ID** que se genera

### 4. Obtener la clave pública
1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key**

### 5. Actualizar el código JavaScript
En el archivo `js/main.js`, reemplaza estas líneas:

```javascript
// Línea ~47
emailjs.init("YOUR_PUBLIC_KEY"); // Reemplazar con tu clave pública

// Líneas ~107-108
'YOUR_SERVICE_ID',    // Reemplazar con tu Service ID
'YOUR_TEMPLATE_ID',   // Reemplazar con tu Template ID
```

### Ejemplo de configuración:
```javascript
emailjs.init("user_1234567890abcdef"); // Tu Public Key

await emailjs.send(
    'service_gmail123',    // Tu Service ID
    'template_abc456',     // Tu Template ID
    templateParams
);
```

## 🔧 Verificación
1. Guarda los cambios
2. Abre tu portfolio
3. Llena el formulario de contacto
4. Envía un mensaje de prueba
5. Revisa tu email `emmyjose82@hotmail.com`

## 🎯 ¿Qué hace el código?
- ✅ Valida el formulario antes de enviar
- ✅ Muestra estado de "Enviando..." durante el proceso
- ✅ Envía el email a `emmyjose82@hotmail.com`
- ✅ Muestra mensaje de éxito o error
- ✅ Limpia el formulario después del envío exitoso
- ✅ Funciona sin backend, directamente desde el navegador

## 📱 Beneficios
- **Gratis**: 200 emails/mes sin costo
- **Seguro**: No expones credenciales en el código
- **Fácil**: Sin necesidad de servidor backend
- **Confiable**: Servicio establecido y estable

## 🆘 Resolución de problemas
- Si no funciona, revisa la consola del navegador
- Verifica que las claves coincidan exactamente
- Asegúrate de que el servicio de email esté activo
- Confirma que la plantilla esté publicada

¡Con esta configuración tendrás un formulario de contacto totalmente funcional! 🚀 