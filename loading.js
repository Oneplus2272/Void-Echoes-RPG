window.onload = () => {
    console.log("Game loading started");
    
    // Инициализация Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if(tg) { 
        tg.expand(); 
        tg.ready(); 
        console.log("Telegram WebApp initialized");
    }
    
    let p = 0; 
    const progressFill = document.getElementById('progress-fill');
    const loadingPct = document.getElementById('loading-pct');
    const loadingScreen = document.getElementById('loading-screen');
    const selectionScreen = document.getElementById('selection-screen');

    const loadingInterval = setInterval(() => {
        p += 5; 
        
        // Обновляем ширину полоски
        if (progressFill) {
            progressFill.style.width = p + '%'; 
        }
        
        // Обновляем текст процентов
        if (loadingPct) {
            loadingPct.textContent = p + '%';
        }
        
        if(p >= 100) { 
            clearInterval(loadingInterval); 
            console.log("Loading complete");
            
            // Скрываем загрузку
            if (loadingScreen) {
                loadingScreen.style.display = 'none'; 
            }
            
            // Показываем экран выбора героя
            if (selectionScreen) {
                selectionScreen.style.display = 'block'; 
                setTimeout(() => {
                    selectionScreen.style.opacity = '1';
                }, 50); 
            }
        }
    }, 30);
};
