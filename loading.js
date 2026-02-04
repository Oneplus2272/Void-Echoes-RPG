window.onload = () => {
    const tg = window.Telegram?.WebApp;
    if(tg) { tg.expand(); tg.ready(); }
    
    let p = 0; 
    const loadingInterval = setInterval(() => {
        p += 5; 
        document.getElementById('progress-fill').style.width = p + '%'; 
        document.getElementById('loading-pct').textContent = p + '%';
        
        if(p >= 100) { 
            clearInterval(loadingInterval); 
            document.getElementById('loading-screen').style.display = 'none'; 
            document.getElementById('selection-screen').style.display = 'block'; 
            setTimeout(() => document.getElementById('selection-screen').style.opacity = '1', 50);
        }
    }, 30);
};
