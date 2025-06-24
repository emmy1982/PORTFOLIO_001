// Scroll Indicator - Manejo independiente del click para scroll suave
(function() {
    'use strict';
    
    function scrollToTarget(target) {
        const aboutSection = document.querySelector(target);
        if (aboutSection) {
            console.log('Ejecutando scroll hacia:', target);
            
            // Múltiples métodos para asegurar que funcione
            // Método 1: scrollIntoView
            aboutSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Método 2: scrollTo como respaldo
            setTimeout(() => {
                const offsetTop = aboutSection.offsetTop - 80; // Considerar altura del header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }, 100);
            
            return true;
        }
        return false;
    }
    
    // Esperar a que el DOM esté completamente cargado
    function initScrollIndicator() {
        console.log('Inicializando scroll indicator...');
        
        // Esperar un poco más para asegurar que Lottie esté cargado
        setTimeout(() => {
            const scrollIndicator = document.querySelector('.scroll-indicator');
            
            if (!scrollIndicator) {
                console.warn('Scroll indicator no encontrado');
                return;
            }
            
            console.log('Scroll indicator encontrado:', scrollIndicator);
            
            // Asegurar que sea clickeable
            scrollIndicator.style.cursor = 'pointer';
            scrollIndicator.style.pointerEvents = 'auto';
            scrollIndicator.style.zIndex = '1000';
            
            // Método 1: Event listener en el enlace principal
            scrollIndicator.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Click en scroll indicator detectado - método 1');
                
                if (scrollToTarget('#about')) {
                    console.log('Scroll ejecutado exitosamente');
                }
            }, true); // Usar capture
            
            // Método 2: Event listener en el documento que capture clicks en el área
            document.addEventListener('click', function(e) {
                if (e.target.closest('.scroll-indicator')) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Click en scroll indicator detectado - método 2');
                    
                    if (scrollToTarget('#about')) {
                        console.log('Scroll ejecutado exitosamente - método 2');
                    }
                }
            });
            
            // Método 3: Event listener específico para el elemento Lottie
            const lottiePlayer = scrollIndicator.querySelector('dotlottie-player');
            if (lottiePlayer) {
                lottiePlayer.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Click en Lottie player detectado');
                    
                    if (scrollToTarget('#about')) {
                        console.log('Scroll ejecutado desde Lottie player');
                    }
                });
                
                // Asegurar que Lottie sea clickeable también
                lottiePlayer.style.cursor = 'pointer';
                lottiePlayer.style.pointerEvents = 'auto';
            }
            
            // Método 4: Event listener en el párrafo
            const scrollText = scrollIndicator.querySelector('p');
            if (scrollText) {
                scrollText.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Click en texto Scroll detectado');
                    
                    if (scrollToTarget('#about')) {
                        console.log('Scroll ejecutado desde texto');
                    }
                });
                
                scrollText.style.cursor = 'pointer';
                scrollText.style.pointerEvents = 'auto';
            }
            
            console.log('Scroll indicator inicializado correctamente con múltiples métodos');
            
        }, 1000); // Esperar 1 segundo para que todo esté cargado
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollIndicator);
    } else {
        initScrollIndicator();
    }
    
    // También inicializar cuando la ventana esté completamente cargada
    window.addEventListener('load', initScrollIndicator);
    
})(); 