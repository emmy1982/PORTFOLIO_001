// Registrar los plugins de GSAP
gsap.registerPlugin(ScrollTrigger, SplitText);

// Cursor personalizado
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
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

    // Efecto hover en enlaces
    document.querySelectorAll('a, button').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(cursorFollower, {
                scale: 1.5,
                duration: 0.3
            });
        });
        
        link.addEventListener('mouseleave', () => {
            gsap.to(cursorFollower, {
                scale: 1,
                duration: 0.3
            });
        });
    });
}

// Animación inicial de la página
const initAnimations = () => {
    // Animación del título principal
    gsap.from('.glitch', {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: 'power4.out'
    });

    // Animación del subtítulo
    gsap.from('.subtitle', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        delay: 0.3,
        ease: 'power4.out'
    });

    // Animación de los botones
    gsap.from('.cta-buttons', {
        duration: 1.5,
        y: 50,
        opacity: 0,
        delay: 0.6,
        ease: 'power4.out'
    });
};

// Animaciones al hacer scroll
const scrollAnimations = () => {
    // Animación de la sección About
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

    // Animación de las tarjetas de proyectos
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

    // Animación de las habilidades
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

    // Animación del formulario de contacto
    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top center',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1
    });
};

// Animación de las barras de progreso
const animateProgressBars = () => {
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
};

// Botón "Volver arriba"
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

// Validación del formulario
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Animación de éxito
        gsap.to(contactForm, {
            y: -20,
            duration: 0.3,
            yoyo: true,
            repeat: 1
        });
        
        // Limpiar el formulario
        contactForm.reset();
    });
}

// Efecto de parallax en el scroll
const parallaxEffect = () => {
    const home = document.querySelector('.home');
    const homeContent = document.querySelector('.home-content');
    
    if (!home || !homeContent) return;
    
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateParallax = () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY <= home.offsetHeight) {
            // Efecto parallax más suave para el contenido
            gsap.to(homeContent, {
                y: currentScrollY * 0.2,
                duration: 0.1,
                ease: 'none'
            });
            
            // Efecto parallax más sutil para el fondo
            gsap.to(home, {
                y: currentScrollY * 0.1,
                duration: 0.1,
                ease: 'none'
            });
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
};

// Partículas animadas de fondo
function createParticlesBG() {
    const canvas = document.getElementById('bg-particles');
    
    if (!canvas) {
        console.warn('Canvas de partículas no encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.warn('No se pudo obtener el contexto 2D del canvas');
        return;
    }
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;
    const PARTICLE_COUNT = 100;
    const PARTICLE_COLOR = 'rgba(255, 255, 255, 0.33)';
    const PARTICLE_RADIUS = 1.2;
    const particles = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Crear partículas
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * PARTICLE_RADIUS + 0.5,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.fill();
        }
    }

    function animateParticles() {
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            // Rebote en los bordes
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        }
        drawParticles();
    }

    // Iniciar la animación
    gsap.ticker.add(animateParticles);
    
    // Dibujar las partículas inicialmente
    drawParticles();
}

// Función para inicializar SplitText
const initSplitText = () => {
    document.fonts.ready.then(() => {
        const splitElements = document.querySelectorAll('.split');
        
        splitElements.forEach(element => {
            const split = new SplitText(element, {
                type: "words,chars",
                wordsClass: "word",
                charsClass: "char"
            });

            // Animación inicial para los elementos split
            gsap.from(split.words, {
                y: 50,
                opacity: 0,
                stagger: 0.05,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: 0.2
            });
        });
    });
};

// Inicializar todas las animaciones
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar partículas primero
    createParticlesBG();
    
    // Inicializar SplitText después
    initSplitText();
    
    // Inicializar otras animaciones
    initAnimations();
    scrollAnimations();
    animateProgressBars();
    parallaxEffect();
});

const segmenter = new Intl.Segmenter("zh", { granularity: "word" });

document.fonts.ready.then(() => {
  gsap.set(".split", { opacity: 1 });

  const split = SplitText.create(".split", {
    type: "words",
    wordsClass: "word",
    prepareText: (text, el) => {
      return [...segmenter.segment(text)].map(s => s.segment).join(String.fromCharCode(8204))
    },
    wordDelimiter: { delimiter: /\u200c/, replaceWith: " " },
    autoSplit: true,
    onSplit: (self) => {
      return gsap.from(self.words, {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "back"
      });
    }
  });
});

    // Animación de la sección Home









            