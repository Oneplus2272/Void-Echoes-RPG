// Логика экрана загрузки
class LoadingScreen {
    constructor() {
        this.loadingPct = document.getElementById('loading-pct');
        this.progressFill = document.getElementById('progress-fill');
        this.init();
    }

    init() {
        this.startLoading();
    }

    startLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            this.updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                this.completeLoading();
            }
        }, 30);
    }

    updateProgress(percent) {
        if (this.progressFill) {
            this.progressFill.style.width = percent + '%';
        }
        if (this.loadingPct) {
            this.loadingPct.textContent = percent + '%';
        }
    }

    completeLoading() {
        console.log('Загрузка завершена');
        setTimeout(() => {
            game.switchScreen('selection');
        }, 500);
    }
}

// Инициализируем экран загрузки
const loadingScreen = new LoadingScreen();
