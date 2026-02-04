class LoadingScreen {
    static start() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 2;
            LoadingScreen.updateProgress(progress);
            
            if (progress >= 100) {
                clearInterval(interval);
                LoadingScreen.complete();
            }
        }, 30);
    }

    static updateProgress(percent) {
        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('loading-pct');
        
        if (fill) fill.style.width = percent + '%';
        if (text) text.textContent = percent + '%';
    }

    static complete() {
        console.log('Loading complete');
        
        // Проверяем, есть ли сохраненный герой
        const savedHero = localStorage.getItem('void_echoes_hero');
        if (savedHero && GameConfig.heroes[savedHero]) {
            game.currentHero = savedHero;
            game.showMenu();
        } else {
            ScreenManager.switchTo('selection');
            SelectionScreen.init();
        }
    }
}
