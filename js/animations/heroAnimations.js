// Animaciones del Hero
const words = ["FRONTEND", "DISEÑO WEB", "DISEÑADOR"];
let currentIndex = 0;
let wordsInterval = null;

// Función para cambiar palabra
function changeWord() {
    const wordEl = document.querySelector('.word-item:first-child');
    if (!wordEl) return;
    
    // Animación de salida
    gsap.to(wordEl, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            // Cambiar texto
            currentIndex = (currentIndex + 1) % words.length;
            wordEl.textContent = words[currentIndex];
            
            // Animación de entrada
            gsap.fromTo(wordEl,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
            );
        }
    });
}

// Inicializar animaciones
function initHeroAnimations() {
    const wordEl = document.querySelector('.word-item:first-child');
    if (!wordEl) return;
    
    // Ocultar las otras palabras
    const otherWords = document.querySelectorAll('.word-item:not(:first-child)');
    otherWords.forEach(word => {
        word.style.display = 'none';
    });
    
    // Iniciar animación de palabras después de 2 segundos
    setTimeout(() => {
        if (wordsInterval) {
            clearInterval(wordsInterval);
        }
        wordsInterval = setInterval(changeWord, 3000);
    }, 2000);
}

// Inicializar cuando GSAP esté disponible
function waitForGSAP() {
    if (typeof gsap !== 'undefined') {
        initHeroAnimations();
    } else {
        setTimeout(waitForGSAP, 100);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForGSAP);
} else {
    waitForGSAP();
} 