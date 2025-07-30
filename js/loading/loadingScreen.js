class LoadingScreen {
    constructor() {
        this.loadingScreen = null;
        this.progressBar = null;
        this.progressText = null;
        this.loadingText = null;
        this.particles = [];
        this.isLoading = true;
        this.progress = 0;
        this.init();
    }

    init() {
        this.createLoadingScreen();
        this.createParticles();
        this.startLoading();
    }

    createLoadingScreen() {
        // Crear el contenedor principal
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loading-screen';
        this.loadingScreen.innerHTML = `
            <div class="loading-background">
                <div class="loading-particles"></div>
            </div>
            <div class="loading-content">
                <div class="loading-logo">
                    <div class="logo-circle">
                        <div class="logo-inner"></div>
                    </div>
                    <h1 class="logo-text">EM</h1>
                </div>
                <div class="loading-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar"></div>
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">0%</div>
                </div>
                <div class="loading-text">
                    <span class="loading-dot">.</span>
                    <span class="loading-dot">.</span>
                    <span class="loading-dot">.</span>
                </div>
            </div>
        `;

        // Agregar estilos CSS dinámicamente
        this.addStyles();
        
        // Insertar al inicio del body
        document.body.insertBefore(this.loadingScreen, document.body.firstChild);
        
        // Obtener referencias a elementos
        this.progressBar = this.loadingScreen.querySelector('.progress-fill');
        this.progressText = this.loadingScreen.querySelector('.progress-text');
        this.loadingText = this.loadingScreen.querySelector('.loading-text');
    }

    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .loading-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                overflow: hidden;
                transition: opacity 0.8s ease, visibility 0.8s ease;
            }

            .loading-screen.fade-out {
                opacity: 0;
                visibility: hidden;
            }

            .loading-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }

            .loading-particles {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(circle at 20% 80%, rgba(255, 107, 51, 0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, rgba(255, 107, 51, 0.1) 0%, transparent 50%);
            }

            .loading-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 3rem;
                z-index: 10;
                position: relative;
            }

            .loading-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .logo-circle {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ff6b33, #ff8f6b);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                animation: logoPulse 2s ease-in-out infinite;
                box-shadow: 0 0 50px rgba(255, 107, 51, 0.5);
            }

            .logo-inner {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .logo-text {
                font-family: 'Anton', sans-serif;
                font-size: 2.5rem;
                font-weight: 100;
                color: #ff6b33;
                margin: 0;
                position: absolute;
                z-index: 2;
                text-shadow: 0 0 20px rgba(255, 107, 51, 0.8);
            }

            @keyframes logoPulse {
                0%, 100% {
                    transform: scale(1);
                    box-shadow: 0 0 50px rgba(255, 107, 51, 0.5);
                }
                50% {
                    transform: scale(1.05);
                    box-shadow: 0 0 80px rgba(255, 107, 51, 0.8);
                }
            }

            .loading-progress {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1rem;
                width: 300px;
            }

            .progress-bar-container {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 2px;
                overflow: hidden;
                position: relative;
            }

            .progress-bar {
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ff6b33, #ff8f6b);
                border-radius: 2px;
                width: 0%;
                transition: width 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% {
                    left: -100%;
                }
                100% {
                    left: 100%;
                }
            }

            .progress-text {
                font-family: 'Poppins', sans-serif;
                font-size: 1.2rem;
                color: #bdbdbd;
                font-weight: 500;
                text-align: center;
            }

            .loading-text {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.2rem;
            }

            .loading-dot {
                font-size: 2rem;
                color: #ff6b33;
                animation: loadingDots 1.4s infinite;
                opacity: 0;
            }

            .loading-dot:nth-child(1) {
                animation-delay: 0s;
            }

            .loading-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .loading-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes loadingDots {
                0%, 80%, 100% {
                    opacity: 0;
                    transform: scale(0.8);
                }
                40% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            /* Partículas flotantes */
            .floating-particle {
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ff6b33;
                border-radius: 50%;
                opacity: 0.6;
                animation: float 6s infinite linear;
            }

            @keyframes float {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .logo-circle {
                    width: 100px;
                    height: 100px;
                }

                .logo-inner {
                    width: 80px;
                    height: 80px;
                }

                .logo-text {
                    font-size: 2rem;
                }

                .loading-progress {
                    width: 250px;
                }

                .progress-text {
                    font-size: 1rem;
                }
            }

            @media (max-width: 480px) {
                .logo-circle {
                    width: 80px;
                    height: 80px;
                }

                .logo-inner {
                    width: 65px;
                    height: 65px;
                }

                .logo-text {
                    font-size: 1.5rem;
                }

                .loading-progress {
                    width: 200px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    createParticles() {
        const particlesContainer = this.loadingScreen.querySelector('.loading-particles');
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    startLoading() {
        // Simular carga de recursos
        const resources = [
            'assets/imagenPerfil.png',
            'assets/imagenPerfil_02.png',
            'assets/academia.png',
            'assets/adobe-photoshop.png',
            'assets/barbershop.png',
            'assets/clinicaDental.png',
            'assets/clinicaPsicologia.png',
            'assets/constop.png',
            'assets/construction.png',
            'assets/deco.png',
            'assets/ecommerce.png',
            'assets/imagen.png',
            'assets/restaurante.png',
            'assets/retrato.png',
            'assets/tattoo.png',
            'assets/webArquitectura.png'
        ];

        let loadedResources = 0;
        const totalResources = resources.length;

        const loadResource = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    loadedResources++;
                    this.updateProgress((loadedResources / totalResources) * 100);
                    resolve();
                };
                img.onerror = () => {
                    loadedResources++;
                    this.updateProgress((loadedResources / totalResources) * 100);
                    resolve();
                };
                img.src = src;
            });
        };

        // Cargar recursos en paralelo
        Promise.all(resources.map(loadResource)).then(() => {
            // Simular un pequeño delay adicional para una transición suave
            setTimeout(() => {
                this.completeLoading();
            }, 500);
        });
    }

    updateProgress(percentage) {
        this.progress = Math.min(percentage, 100);
        this.progressBar.style.width = this.progress + '%';
        this.progressText.textContent = Math.round(this.progress) + '%';
    }

    completeLoading() {
        // Animación de salida
        this.loadingScreen.classList.add('fade-out');
        
        // Remover la pantalla de carga después de la animación
        setTimeout(() => {
            if (this.loadingScreen && this.loadingScreen.parentNode) {
                this.loadingScreen.parentNode.removeChild(this.loadingScreen);
            }
            this.isLoading = false;
            
            // Disparar evento personalizado para notificar que la carga ha terminado
            document.dispatchEvent(new CustomEvent('loadingComplete'));
        }, 800);
    }

    // Método para verificar si la carga ha terminado
    isLoadingComplete() {
        return !this.isLoading;
    }
}

// Exportar la clase para uso global
window.LoadingScreen = LoadingScreen; 