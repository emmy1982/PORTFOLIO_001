// Formulario de contacto con EmailJS
let isEmailJSLoaded = false;

// Esperar a que EmailJS esté disponible
function waitForEmailJS() {
    return new Promise((resolve) => {
        if (typeof emailjs !== 'undefined') {
            resolve();
        } else {
            setTimeout(() => waitForEmailJS().then(resolve), 100);
        }
    });
}

// Inicializar EmailJS cuando esté disponible
waitForEmailJS().then(() => {
    emailjs.init("hcGBdHBVGLxYI5jur");
    isEmailJSLoaded = true;
    initContactForm();
}).catch(error => {
    console.error('Error al cargar EmailJS:', error);
    // Inicializar formulario sin EmailJS como respaldo
    initContactForm();
});

// Función principal del formulario
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitButton = form.querySelector('.btn.primary');
    const originalButtonText = submitButton.textContent;

    // Utilidad de debounce local
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const validateField = (field) => {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) return true;

        let isValid = field.checkValidity();
        let message = '';

        if (!isValid) {
            if (field.validity.valueMissing) {
                message = 'Este campo es requerido';
            } else if (field.validity.typeMismatch && field.type === 'email') {
                message = 'Por favor, introduce un email válido';
            } else if (field.validity.tooShort) {
                message = `Mínimo ${field.minLength} caracteres`;
            } else if (field.validity.patternMismatch && field.type === 'text') {
                message = 'Solo se permiten letras y espacios';
            }
        }

        errorElement.textContent = message;
        field.setAttribute('aria-invalid', !isValid);
        return isValid;
    };

    const showMessage = (message, isError = false) => {
        // Crear o actualizar mensaje de estado
        let statusMessage = form.querySelector('.form-status-message');
        if (!statusMessage) {
            statusMessage = document.createElement('div');
            statusMessage.className = 'form-status-message';
            form.appendChild(statusMessage);
        }
        
        statusMessage.textContent = message;
        statusMessage.className = `form-status-message ${isError ? 'error' : 'success'}`;
        statusMessage.style.cssText = `
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            ${isError ? 
                'background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid #ff6b6b;' : 
                'background: rgba(46, 213, 115, 0.1); color: #2ed573; border: 1px solid #2ed573;'
            }
        `;
        
        setTimeout(() => {
            if (statusMessage.parentNode) {
                statusMessage.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => statusMessage.remove(), 300);
            }
        }, 5000);
    };

    const sendEmail = async (formData) => {
        if (!isEmailJSLoaded) {
            showMessage('Error: Servicio de email no disponible', true);
            return false;
        }

        try {
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                message: formData.get('message'),
                to_email: 'emmyjose82@hotmail.com'
            };

            await emailjs.send(
                'service_968vetk',
                'template_szbjqng',
                templateParams
            );

            return true;
        } catch (error) {
            console.error('Error enviando email:', error);
            return false;
        }
    };

    // Event listener para el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        if (isValid) {
            // Deshabilitar botón y mostrar loading
            submitButton.disabled = true;
            submitButton.textContent = 'Enviando...';
            
            const formData = new FormData(form);
            const emailSent = await sendEmail(formData);
            
            if (emailSent) {
                showMessage('¡Mensaje enviado correctamente! Te responderé pronto.');
                form.reset();
                // Limpiar validaciones
                fields.forEach(field => {
                    field.setAttribute('aria-invalid', 'false');
                    const errorElement = field.parentElement.querySelector('.error-message');
                    if (errorElement) errorElement.textContent = '';
                });
            } else {
                showMessage('Error al enviar el mensaje. Por favor, inténtalo de nuevo.', true);
            }
            
            // Restaurar botón
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    // Event listeners para validación en tiempo real
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', debounce(() => validateField(field), 300));
    });
}

// CSS para animaciones de mensajes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(style);

// Inicializar si el DOM ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
} 