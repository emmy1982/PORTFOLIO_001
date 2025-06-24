// Variables globales
let isGSAPLoaded = false;
let animations = [];
let wordsInterval;

// Esperar a que GSAP esté disponible
function waitForGSAP() {
    return new Promise((resolve) => {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            resolve();
        } else {
            setTimeout(() => waitForGSAP().then(resolve), 100);
        }
    });
}

// Registrar plugins cuando estén disponibles
waitForGSAP().then(() => {
    gsap.registerPlugin(ScrollTrigger);
    isGSAPLoaded = true;
    console.log('GSAP plugins registrados');
    
    // Configurar ScrollTrigger para responsive
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });
    
    initAll();
}).catch(error => {
    console.error('Error al cargar GSAP:', error);
});

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

// Cursor personalizado - solo en desktop
function initCursor() {
    if (window.innerWidth < 1024) return;
    
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    let rafId;
    function updateCursor(e) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
            if (isGSAPLoaded) {
                gsap.to(cursor, {
                    x: e.clientX - 5,
                    y: e.clientY - 5,
                    duration: 0.1
                });
            }
        });
    }

    document.addEventListener('mousemove', updateCursor, { passive: true });
}

// Partículas animadas de fondo optimizadas
function createParticlesBG() {
    const canvas = document.getElementById('bg-particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Reducir partículas en móvil
    const particleCount = window.innerWidth < 768 ? 15 : 25;
    const particles = new Array(particleCount).fill(null).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2
    }));
    
    let animationId;
    let isVisible = true;

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.43)';
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

    // Pausar cuando no es visible
    const observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
        if (isVisible && !animationId) {
            animateParticles();
        } else if (!isVisible && animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });
    observer.observe(canvas);

    const debouncedResize = debounce(() => {
        if (animationId) cancelAnimationFrame(animationId);
        resizeCanvas();
        animateParticles();
    }, 250);

    resizeCanvas();
    animateParticles();
    window.addEventListener('resize', debouncedResize, { passive: true });
}

// Animaciones básicas
function initAnimations() {
    if (!isGSAPLoaded) return;
    
    // Limpiar animaciones previas
    animations.forEach(anim => anim.kill());
    animations = [];

    // Animación del título principal con delay
    setTimeout(() => {
        const glitchAnimation = gsap.from('.glitch', {
            duration: 1.2,
            y: 80,
            opacity: 0,
            ease: 'power3.out',
            stagger: 0.15
        });
        animations.push(glitchAnimation);
    }, 500);

    // Animación de palabras cambiantes
    setTimeout(() => {
        initChangingWords();
    }, 1000);
}

// Animación de palabras cambiantes CORREGIDA
function initChangingWords() {
    const words = document.querySelectorAll('.word-item');
    if (!words.length || !isGSAPLoaded) return;

    // Limpiar intervalo anterior si existe
    if (wordsInterval) {
        clearInterval(wordsInterval);
    }

    let currentIndex = 0;

    // Configuración inicial - solo mostrar la primera palabra
    words.forEach((word, index) => {
        if (index === 0) {
            gsap.set(word, { opacity: 1, y: 0, position: 'absolute', top: '0%' });
        } else {
            gsap.set(word, { opacity: 0, y: 100, position: 'absolute', top: '0%' });
        }
    });

    function changeWord() {
        const currentWord = words[currentIndex];
        const nextIndex = (currentIndex + 1) % words.length;
        const nextWord = words[nextIndex];
        
        // Animación sincronizada
        const tl = gsap.timeline();
        
        // Salida de la palabra actual
        tl.to(currentWord, {
            duration: 0.4,
            opacity: 0,
            y: -50,
            ease: 'power2.in'
        })
        // Entrada de la siguiente palabra
        .fromTo(nextWord, {
            opacity: 0,
            y: 50
        }, {
            duration: 0.6,
            opacity: 1,
            y: 0,
            ease: 'power2.out'
        }, 0.2);

        currentIndex = nextIndex;
    }

    // Iniciar ciclo cada 3 segundos
    wordsInterval = setInterval(changeWord, 3000);
}

// ScrollTrigger optimizado y corregido
function initScrollAnimations() {
    if (!isGSAPLoaded) return;

    // Limpiar ScrollTriggers existentes
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Animación para todos los títulos de sección
    document.querySelectorAll('.section-title').forEach((title, index) => {
        gsap.fromTo(title, 
            {
                y: 50,
                opacity: 0,
                scale: 0.9
            },
            {
                duration: 1.2,
                ease: "power3.out",
                y: 0,
                opacity: 1,
                scale: 1,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    end: 'bottom 25%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => console.log(`Título ${index + 1} animado: ${title.textContent}`)
                }
            }
        );
    });

    // Animación para todos los subtítulos
    document.querySelectorAll('.about-subtitle').forEach((subtitle, index) => {
        gsap.fromTo(subtitle, 
            {
                y: 30,
                opacity: 0,
                scale: 0.95
            },
            {
                duration: 1,
                ease: "power3.out",
                y: 0,
                opacity: 1,
                scale: 1,
                delay: 0.3,
                scrollTrigger: {
                    trigger: subtitle,
                    start: 'top 85%',
                    end: 'bottom 25%',
                    toggleActions: 'play none none reverse',
                    onEnter: () => console.log(`Subtítulo ${index + 1} animado: ${subtitle.textContent}`)
                }
            }
        );
    });

    // Animación para contenedores de sección
    document.querySelectorAll('.container').forEach((container, index) => {
        // Solo animar contenedores que no están en el home
        if (!container.closest('#home')) {
            gsap.fromTo(container, 
                {
                    y: 20,
                    opacity: 0.8
                },
                {
                    duration: 1.5,
                    ease: "power2.out",
                    y: 0,
                    opacity: 1,
                    delay: 0.1,
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 90%',
                        end: 'bottom 10%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    });

    // About section
    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse'
        },
        x: -80,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse'
        },
        x: 80,
        opacity: 0,
        duration: 1.2,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Projects - CORREGIDO para aparecer
    gsap.to('.project-card', {
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Skills grid
    gsap.to('.skills-grid', {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    // About scale effect - FUNCIONAL
    gsap.to('.about', {
        scale: 1.2,
        transformOrigin: 'center center',
        ease: 'none',
        scrollTrigger: {
            trigger: '.about',
            start: 'top 90%',
            end: 'bottom 10%',
            scrub: 1,
            markers: false,
            onEnter: () => console.log('About scale animation started'),
            onUpdate: (self) => {
                console.log('Scale progress:', self.progress.toFixed(2));
            }
        }
    });

    // Circle container effect - MEJORADO para no conflictuar
    if (window.innerWidth > 768) {
        gsap.fromTo('.circle-container', {
            transform: 'translateY(-50%) scale(1)'
        }, {
            transform: 'translateY(-50%) scale(1.8)',
            ease: 'none',
            scrollTrigger: {
                trigger: '.about',
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 2,
                markers: false
            }
        });
    }
}

// Animación de texto personalizada
function initTextAnimation() {
    if (!isGSAPLoaded) return;
    
    const splitElement = document.querySelector('.split-1');
    if (!splitElement) return;

    // Esperar un momento para asegurar renderizado
    setTimeout(() => {
        try {
            function splitTextIntoWords(element) {
                const text = element.textContent;
                const words = text.split(' ');
                
                element.innerHTML = '';
                const allElements = [];
                
                words.forEach((word, index) => {
                    const wordSpan = document.createElement('span');
                    wordSpan.textContent = word;
                    wordSpan.className = 'animated-word';
                    wordSpan.style.cssText = 'display: inline-block; opacity: 0; transform: translateY(50px);';
                    element.appendChild(wordSpan);
                    allElements.push(wordSpan);
                    
                    if (index < words.length - 1) {
                        const spaceSpan = document.createElement('span');
                        spaceSpan.textContent = ' ';
                        spaceSpan.className = 'word-space';
                        spaceSpan.style.cssText = 'display: inline-block; opacity: 0; transform: translateY(50px);';
                        element.appendChild(spaceSpan);
                        allElements.push(spaceSpan);
                    }
                });
                
                return allElements;
            }

            const paragraphs = splitElement.querySelectorAll('p');
            const allElements = [];
            
            paragraphs.forEach(paragraph => {
                const elements = splitTextIntoWords(paragraph);
                allElements.push(...elements);
            });

            if (allElements.length > 0) {
                gsap.to(allElements, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.03,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.split-1',
                        start: 'top 85%',
                        end: 'bottom 15%',
                        toggleActions: 'play none none reverse'
                    }
                });
            }
        } catch (error) {
            console.error('Error en animación de texto:', error);
        }
    }, 1500);
}

// Botón volver arriba
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;
    
    let ticking = false;
    
    function updateButton() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        ticking = false;
    }
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateButton);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Validación de formulario
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

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = form.querySelectorAll('input, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!validateField(field)) isValid = false;
        });
        
        if (isValid) {
            console.log('Formulario válido');
            // Aquí iría la lógica de envío
        }
    });

    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', debounce(() => validateField(field), 300));
    });
}

// Menú hamburguesa optimizado
function initHamburgerMenu() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const fullscreenMenu = document.querySelector('.fullscreen-menu');
    const menuClose = document.querySelector('.menu-close');
    const menuLinks = document.querySelectorAll('.menu-link');
    const body = document.body;

    if (!hamburgerMenu || !fullscreenMenu) return;

    function openMenu() {
        hamburgerMenu.classList.add('active');
        fullscreenMenu.classList.add('active');
        body.classList.add('menu-open');
        body.style.overflow = 'hidden';
        
        if (isGSAPLoaded) {
            gsap.fromTo(fullscreenMenu, 
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
            );

            gsap.fromTo(menuLinks,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
            );
        }
    }

    function closeMenu() {
        hamburgerMenu.classList.remove('active');
        
        if (isGSAPLoaded) {
            gsap.to(fullscreenMenu, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    fullscreenMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                    body.style.overflow = '';
                }
            });
        } else {
            fullscreenMenu.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
        }
    }

    hamburgerMenu.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            
            closeMenu();
            setTimeout(() => {
                const targetElement = document.querySelector(target);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Header scroll optimizado
function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    let isScrolled = false;
    let isHidden = false;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.scrollY;
        
        // Mostrar/ocultar header
        if (currentScroll > lastScroll && currentScroll > 100 && !isHidden) {
            if (isGSAPLoaded) {
                gsap.to(header, { y: '-100%', duration: 0.3, ease: 'power2.out' });
            }
            isHidden = true;
        } else if (currentScroll < lastScroll && isHidden) {
            if (isGSAPLoaded) {
                gsap.to(header, { y: '0%', duration: 0.3, ease: 'power2.out' });
            }
            isHidden = false;
        }
        
        // Efecto scrolled
        if (currentScroll > 0 && !isScrolled) {
            header.classList.add('scrolled');
            isScrolled = true;
        } else if (currentScroll === 0 && isScrolled) {
            header.classList.remove('scrolled');
            isScrolled = false;
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
}

// Función principal de inicialización
function initAll() {
    const features = [
        { fn: initCursor, id: 'cursor' },
        { fn: createParticlesBG, id: 'particles' },
        { fn: initAnimations, id: 'animations' },
        { fn: initScrollAnimations, id: 'scrollAnimations' },
        { fn: initBackToTop, id: 'backToTop' },
        { fn: initForm, id: 'form' },
        { fn: initHamburgerMenu, id: 'menu' },
        { fn: initScrollHeader, id: 'header' },
        { fn: initTextAnimation, id: 'textAnimation' }
    ];

    features.forEach(({ fn, id }) => {
        try {
            fn();
        } catch (error) {
            console.error(`Error al inicializar ${id}:`, error);
        }
    });
}

// Optimización para cambios de orientación y resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (isGSAPLoaded) {
            ScrollTrigger.refresh();
        }
        
        // Reinicializar cursor solo en desktop
        if (window.innerWidth >= 1024) {
            initCursor();
        }
        
        // Limpiar y reinicializar palabras cambiantes
        if (wordsInterval) {
            clearInterval(wordsInterval);
        }
        initChangingWords();
    }, 250);
}, { passive: true });

// Inicialización cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (isGSAPLoaded) {
            initAll();
        }
    });
} else if (isGSAPLoaded) {
    initAll();
}