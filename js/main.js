// Variables globales
let isGSAPLoaded = false;
let animations = [];
let resourcesLoaded = false;

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

// Esperar a que todos los recursos críticos estén cargados
function waitForResources() {
    return new Promise((resolve) => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve, { once: true });
        }
    });
}

// Registrar plugins cuando estén disponibles
Promise.all([waitForGSAP(), waitForResources()]).then(() => {
    gsap.registerPlugin(ScrollTrigger);
    isGSAPLoaded = true;
    resourcesLoaded = true;
    
    // Configurar ScrollTrigger para responsive
    ScrollTrigger.config({
        autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize"
    });
    
    initAll();
}).catch(error => {
    console.error('Error al cargar recursos:', error);
    // Fallback: inicializar sin GSAP
    resourcesLoaded = true;
    initAll();
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

// ScrollTrigger optimizado con mejor manejo de errores
function initScrollAnimations() {
    if (!isGSAPLoaded) return;

    // Limpiar ScrollTriggers existentes
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Animación para títulos de sección
    document.querySelectorAll('.section-title').forEach((title) => {
        gsap.fromTo(title, 
            { y: 50, opacity: 0, scale: 0.9 },
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
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Animación para subtítulos
    document.querySelectorAll('.about-subtitle').forEach((subtitle) => {
        gsap.fromTo(subtitle, 
            { y: 30, opacity: 0, scale: 0.95 },
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
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // Animación para contenedores
    document.querySelectorAll('.container').forEach((container) => {
        if (!container.closest('#home')) {
            gsap.fromTo(container, 
                { y: 20, opacity: 0.8 },
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

    // About section - Animaciones específicas y directas
    const aboutImage = document.querySelector('.about-image');
    const aboutText = document.querySelector('.about-text');
    
    if (aboutImage) {
        // Forzar estado inicial
        gsap.set(aboutImage, { opacity: 0, x: -100 });
        
        gsap.to(aboutImage, 
            {
                scrollTrigger: {
                    trigger: aboutImage,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 1,
                x: 0,
                duration: 1,
                ease: 'power2.out'
            }
        );
    }
    
    if (aboutText) {
        // Forzar estado inicial
        gsap.set(aboutText, { opacity: 0, x: 100 });
        
        gsap.to(aboutText, 
            {
                scrollTrigger: {
                    trigger: aboutText,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 1,
                x: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power2.out'
            }
        );
    }

    // Projects
    gsap.fromTo('.project-card', 
        { y: 50, opacity: 0 },
        {
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
        }
    );

    // Skills grid
    gsap.fromTo('.skills-grid', 
        { opacity: 0, y: 100 },
        {
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
        }
    );

    // Circle container effect
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
                scrub: 2
            }
        });
    }
}

// Botón volver arriba optimizado
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Función placeholder para formulario (manejado por emailForm.js)
function initForm() {
    // La funcionalidad del formulario se maneja en emailForm.js
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

// Control de visibilidad del my-link optimizado
function initMyLinkVisibility() {
    const myLink = document.querySelector('.my-link');
    if (!myLink) return;
    
    let ticking = false;

    function updateMyLinkVisibility() {
        const heroSection = document.querySelector('#home');
        if (!heroSection) return;
        
        const heroHeight = heroSection.offsetHeight;
        const currentScroll = window.scrollY;
        
        if (currentScroll > heroHeight * 0.2) {
            if (isGSAPLoaded) {
                gsap.to(myLink, { 
                    opacity: 0, 
                    transform: 'translateY(-50%) translateX(-50px) rotate(180deg)',
                    duration: 0.3, 
                    ease: 'power2.out' 
                });
            } else {
                myLink.style.opacity = '0';
                myLink.style.transform = 'translateY(-50%) translateX(-50px) rotate(180deg)';
            }
        } else {
            if (isGSAPLoaded) {
                gsap.to(myLink, { 
                    opacity: 1, 
                    transform: 'translateY(-50%) translateX(0px) rotate(180deg)',
                    duration: 0.3, 
                    ease: 'power2.out' 
                });
            } else {
                myLink.style.opacity = '1';
                myLink.style.transform = 'translateY(-50%) translateX(0px) rotate(180deg)';
            }
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(updateMyLinkVisibility);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
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
        { fn: initScrollAnimations, id: 'scrollAnimations' },
        { fn: initBackToTop, id: 'backToTop' },
        { fn: initForm, id: 'form' },
        { fn: initHamburgerMenu, id: 'menu' },
        { fn: initScrollHeader, id: 'header' },
        { fn: initMyLinkVisibility, id: 'myLinkVisibility' }
    ];

    features.forEach(({ fn, id }) => {
        try {
            fn();
        } catch (error) {
            console.error(`Error al inicializar ${id}:`, error);
        }
    });
    
    // Refrescar ScrollTrigger después de que todo esté inicializado
    if (isGSAPLoaded && resourcesLoaded) {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    }
}

// Optimización para resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (isGSAPLoaded) {
            ScrollTrigger.refresh();
        }
        
        if (window.innerWidth >= 1024) {
            initCursor();
        }
    }, 250);
}, { passive: true });

// Inicialización mejorada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Para dispositivos móviles o conexiones lentas, usar un timeout más largo
        const isMobile = window.innerWidth < 768;
        const timeout = isMobile ? 2000 : 1000;
        
        if (isGSAPLoaded && resourcesLoaded) {
            initAll();
        } else {
            // Si GSAP no está disponible, al menos asegurar visibilidad
            setTimeout(() => {
                if (isGSAPLoaded && resourcesLoaded) {
                    initAll();
                } else {
                    // Fallback final
                    initAll();
                }
            }, timeout);
        }
    });
} else {
    // DOM ya está listo
    const isMobile = window.innerWidth < 768;
    const timeout = isMobile ? 2000 : 1000;
    
    if (isGSAPLoaded && resourcesLoaded) {
        initAll();
    } else {
        setTimeout(() => {
            if (isGSAPLoaded && resourcesLoaded) {
                initAll();
            } else {
                // Fallback final
                initAll();
            }
        }, timeout);
    }
}