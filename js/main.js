// Esperar a que GSAP esté disponible
function waitForGSAP() {
    return new Promise((resolve) => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof SplitText !== 'undefined') {
            resolve();
        } else {
            setTimeout(() => waitForGSAP().then(resolve), 100);
        }
    });
}

// Registrar plugins cuando estén disponibles
waitForGSAP().then(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    console.log('GSAP plugins registrados');
    initAll();
}).catch(error => {
    console.error('Error al cargar GSAP:', error);
});

// Cursor personalizado con debounce
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (cursor && cursorFollower) {
        let rafId;
        function updateCursor(e) {
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
            rafId = requestAnimationFrame(() => {
                gsap.to(cursor, {
                    x: e.clientX - 5,
                    y: e.clientY - 5,
                    duration: 0.1
                });
                
                gsap.to(cursorFollower, {
                    x: e.clientX - 15,
                    y: e.clientY - 15,
                    duration: 0.3
                });
            });
        }

        document.addEventListener('mousemove', updateCursor, { passive: true });

        // Efecto hover en enlaces con delegación de eventos
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('a, button')) {
                gsap.to(cursorFollower, {
                    scale: 1.5,
                    duration: 0.3
                });
            }
        }, { passive: true });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('a, button')) {
                gsap.to(cursorFollower, {
                    scale: 1,
                    duration: 0.3
                });
            }
        }, { passive: true });
    }
}

// Partículas animadas de fondo con optimización
function createParticlesBG() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    const particles = new Array(50).fill(null).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5
    }));
    
    let animationId;
    let isVisible = true;

    // Intersection Observer para pausar la animación cuando no es visible
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible) {
            if (!animationId) animateParticles();
        } else if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });
    observer.observe(canvas);

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        });
    }

    function animateParticles() {
        if (!isVisible) return;
        drawParticles();
        animationId = requestAnimationFrame(animateParticles);
    }

    const debouncedResize = debounce(() => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        resizeCanvas();
        animateParticles();
    }, 250);

    resizeCanvas();
    animateParticles();
    window.addEventListener('resize', debouncedResize, { passive: true });
}

// Utilidad de debounce
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

// SplitText
function initSplitText() {
    const splitElements = document.querySelectorAll('.split');
    
    if (splitElements.length === 0) {
        console.warn('No se encontraron elementos con clase .split');
        return;
    }
    
    splitElements.forEach((element, index) => {
        try {
            const split = new SplitText(element, {
                type: "words,chars",
                wordsClass: "word",
                charsClass: "char"
            });

            gsap.from(split.words, {
                y: 50,
                opacity: 0,
                stagger: 0.05,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: 0.2 + (index * 0.3)
            });
        } catch (error) {
            console.error('Error al inicializar SplitText:', error);
        }
    });
}

// Animaciones básicas
function initAnimations() {
    // Animación del título principal
    gsap.from('.glitch', {
        duration: 1.5,
        y: 200,
        opacity: 0,
        ease: 'back.out(1.9)'
    });

    // Animación de los botones
    gsap.from('.cta-buttons', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        delay: 0.6,
        ease: 'power4.out'
    });

    // Animación de palabras cambiantes
    initChangingWords();
}

// Animación de palabras cambiantes
function initChangingWords() {
    const words = document.querySelectorAll('.word-item');
    if (!words.length) {
        console.warn('No se encontraron elementos .word-item');
        return;
    }

    let currentIndex = 0;

    // Mostrar la primera palabra
    words[0].style.opacity = '1';
    words[0].style.top = '0';
    
    // Ocultar las demás
    for (let i = 1; i < words.length; i++) {
        words[i].style.opacity = '0';
        words[i].style.top = '100%';
    }

    // Función para cambiar palabra
    function changeWord() {
        const nextIndex = (currentIndex + 1) % words.length;
        
        // Ocultar palabra actual
        gsap.to(words[currentIndex], {
            duration: 0.3,
            opacity: 0,
            top: '-100%',
            ease: 'bounce.out',
            stagger: 0.05
        });

        // Mostrar siguiente palabra
        gsap.fromTo(words[nextIndex],
            {
                opacity: 0,
                top: '100%',
                scale: 0.95
            },
            {
                duration: 1.2,
                opacity: 1,
                top: '0%',
                scale: 1,
                ease: 'bounce.out',
                stagger: 0.05
            }
        );

        currentIndex = nextIndex;
    }

    // Cambiar palabra cada 4 segundos
    setInterval(changeWord, 3000);
}

// ScrollTrigger
function initScrollAnimations() {
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 1
    });

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 1
    });

    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    });

    gsap.from('.skill-card', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2
    });
}

// Barras de progreso
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top center',
                toggleActions: 'play none none reverse'
            },
            width: `${progress}%`,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
}

// Botón volver arriba
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Validación de formulario mejorada
function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

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

    const validateForm = () => {
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        return isValid;
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Aquí iría la lógica de envío del formulario
            console.log('Formulario válido, listo para enviar');
        }
    });

    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', debounce(() => validateField(field), 300));
    });
}

// Menú hamburguesa
function initHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const menuClose = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');
    const body = document.body;

    function openMenu() {
        hamburgerMenu.classList.add('active');
        fullscreenMenu.classList.add('active');
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
        
        // Animación de entrada con GSAP
        gsap.fromTo(fullscreenMenu, 
            { 
                scale: 0.8, 
                rotation: -5,
                opacity: 0 
            },
            { 
                scale: 1, 
                rotation: 0,
                opacity: 1, 
                duration: 0.6, 
                ease: "back.out(1.7)" 
            }
        );

        // Animación de los enlaces del menú
        gsap.fromTo(menuLinks,
            { 
                y: 100, 
                opacity: 0,
                rotationX: 90
            },
            { 
                y: 0, 
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "back.out(1.7)",
                delay: 0.3
            }
        );

        // Efecto de partículas en el menú
        createMenuParticles();
    }

    function closeMenu() {
        hamburgerMenu.classList.remove('active');
        
        // Animación de salida
        gsap.to(fullscreenMenu, {
            scale: 0.8,
            rotation: 5,
            opacity: 0,
            duration: 0.4,
            ease: "back.in(1.7)",
            onComplete: () => {
                fullscreenMenu.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });

        // Animación de salida de los enlaces
        gsap.to(menuLinks, {
            y: -50,
            opacity: 0,
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.in"
        });
    }

    // Event listeners
    hamburgerMenu.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);

    // Cerrar menú al hacer clic en un enlace
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            // Animación de clic
            gsap.to(link, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    closeMenu();
                    // Navegar después de cerrar el menú
                    setTimeout(() => {
                        document.querySelector(target).scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 500);
                }
            });
        });
    });

    // Cerrar menú con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Cerrar menú al hacer clic fuera del contenido
    fullscreenMenu.addEventListener('click', (e) => {
        if (e.target === fullscreenMenu) {
            closeMenu();
        }
    });
}

// Partículas del menú
function createMenuParticles() {
    const menuParticles = document.querySelector('.menu-particles');
    if (!menuParticles) return;

    // Limpiar partículas existentes
    menuParticles.innerHTML = '';

    // Crear partículas flotantes
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(108, 99, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            animation: floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite;
        `;
        menuParticles.appendChild(particle);
    }

    // Agregar keyframes para la animación de partículas
    if (!document.querySelector('#menu-particles-style')) {
        const style = document.createElement('style');
        style.id = 'menu-particles-style';
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) scale(1);
                    opacity: 0.3;
                }
                25% { 
                    transform: translateY(-20px) translateX(10px) scale(1.2);
                    opacity: 0.8;
                }
                50% { 
                    transform: translateY(-40px) translateX(-10px) scale(0.8);
                    opacity: 0.5;
                }
                75% { 
                    transform: translateY(-20px) translateX(5px) scale(1.1);
                    opacity: 0.7;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Scroll handler para el navbar
function initScrollHeader() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    let isScrolled = false;

    // Aplicar clase scrolled al cargar si no estamos al inicio
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
        isScrolled = true;
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 0 && !isScrolled) {
            header.classList.add('scrolled');
            isScrolled = true;
        } else if (currentScroll === 0 && isScrolled) {
            header.classList.remove('scrolled');
            isScrolled = false;
        }

        lastScroll = currentScroll;
    });
}

// Función principal de inicialización
function initAll() {
    const features = [
        { fn: initCursor, id: 'cursor' },
        { fn: createParticlesBG, id: 'particles' },
        { fn: initSplitText, id: 'splitText' },
        { fn: initAnimations, id: 'animations' },
        { fn: initScrollAnimations, id: 'scrollAnimations' },
        { fn: initProgressBars, id: 'progressBars' },
        { fn: initBackToTop, id: 'backToTop' },
        { fn: initForm, id: 'form' },
        { fn: initHamburgerMenu, id: 'menu' },
        { fn: initScrollHeader, id: 'header' }
    ];

    features.forEach(({ fn, id }) => {
        try {
            fn();
        } catch (error) {
            console.error(`Error al inicializar ${id}:`, error);
        }
    });
}

// Esperar a que el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    // DOM ya está listo
    initAll();
}

