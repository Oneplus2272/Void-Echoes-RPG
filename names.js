(function() {
    // 1. Список ВСЕХ 10 иконок в одном массиве
    const buttonsData = [
        { id: 'profile',   img: 'icon_profile.png' },
        { id: 'battle',    img: 'icon_battle.png' },
        { id: 'quests',    img: 'icon_quests.png' },
        { id: 'calendar',  img: 'icon_calendar.png' },
        { id: 'alliance',  img: 'icon_alliance.png' },
        { id: 'community', img: 'icon_community.png' },
        { id: 'mail',      img: 'icon_mail.png' },
        { id: 'rating',    img: 'icon_rating.png' },
        { id: 'benchmark', img: 'icon_benchmark.png' },
        { id: 'lotto',     img: 'icon_lotto.png' }
    ];

    // 2. Стили (никаких стрелок и анимаций страниц)
    const style = document.createElement('style');
    style.innerHTML = `
        .editor-canvas {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 100;
        }
        .draggable-btn {
            position: absolute; display: flex; align-items: center; justify-content: center;
            touch-action: none; user-select: none; z-index: 1000; pointer-events: auto;
        }
        .draggable-btn img { pointer-events: none; object-fit: contain; width: 80px; height: 80px; }
        
        #ui-controls { position: fixed; top: 80px; right: 20px; z-index: 10000; }
        .save-btn { padding: 15px 25px; background: #ffd700; border: none; font-weight: bold; border-radius: 10px; color: #000; cursor: pointer; box-shadow: 0 0 15px rgba(0,0,0,0.7); }
        
        #layout-output {
            position: fixed; top: 10%; left: 10%; width: 80%; height: 70%;
            background: #000; color: #0f0; padding: 20px; z-index: 10001;
            display: none; font-family: monospace; border: 2px solid #ffd700;
        }
    `;
    document.head.appendChild(style);

    function initLayout() {
        const menu = document.querySelector('#menu-screen .menu-container') || document.body;
        
        const canvas = document.createElement('div');
        canvas.className = 'editor-canvas';
        menu.appendChild(canvas);

        buttonsData.forEach((data, index) => {
            const btn = document.createElement('div');
            btn.className = 'draggable-btn';
            btn.id = data.id;
            
            // Расставляем все 10 штук сеткой 5х2 в центре экрана для начала
            btn.style.left = (50 + (index % 5) * 110) + 'px';
            btn.style.top = (150 + Math.floor(index / 5) * 120) + 'px';
            
            btn.innerHTML = `<img src="${data.img}">`;
            setupTouchEvents(btn);
            canvas.appendChild(btn);
        });

        // Кнопка сохранения
        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn'; 
        saveBtn.innerText = 'СОХРАНИТЬ ВСЁ';
        
        const controls = document.createElement('div');
        controls.id = 'ui-controls'; 
        controls.appendChild(saveBtn);
        
        const output = document.createElement('textarea');
        output.id = 'layout-output';
        output.placeholder = 'Тут появятся координаты...';
        output.onclick = () => output.style.display = 'none';

        saveBtn.onclick = () => {
            const res = [];
            document.querySelectorAll('.draggable-btn').forEach(el => {
                res.push({
                    id: el.id,
                    x: parseInt(el.style.left),
                    y: parseInt(el.style.top),
                    size: parseInt(el.querySelector('img').style.width || 80)
                });
            });
            output.value = JSON.stringify(res, null, 2);
            output.style.display = 'block';
        };

        document.body.appendChild(controls);
        document.body.appendChild(output);
    }

    // Универсальный тач для планшетов
    function setupTouchEvents(el) {
        let startDist = 0, startSize = 80;
        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                let t = e.touches[0];
                let sX = t.clientX - el.offsetLeft;
                let sY = t.clientY - el.offsetTop;
                function move(ev) {
                    el.style.left = (ev.touches[0].clientX - sX) + 'px';
                    el.style.top = (ev.touches[0].clientY - sY) + 'px';
                }
                el.addEventListener('touchmove', move);
                el.addEventListener('touchend', () => el.removeEventListener('touchmove', move), {once:true});
            } else if (e.touches.length === 2) {
                startDist = Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
                startSize = parseInt(el.querySelector('img').style.width || 80);
            }
        });
        el.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                let dist = Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
                let newS = Math.max(30, Math.min(500, startSize * (dist / startDist)));
                el.querySelector('img').style.width = el.querySelector('img').style.height = newS + 'px';
            }
        });
    }

    initLayout();
})();
