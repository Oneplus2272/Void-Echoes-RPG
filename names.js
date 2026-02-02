(function() {
    let EDIT_MODE = true; 
    let currentPage = 1;
    
    // Проверка на планшет (ширина > 768px)
    const isTablet = window.innerWidth > 768;

    // Список всех 10 иконок
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

    const style = document.createElement('style');
    style.innerHTML = `
        .canvas-page {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            transition: transform 0.5s ease-in-out; pointer-events: none; z-index: 100;
        }
        .canvas-page.active { pointer-events: auto; }
        
        .draggable-btn {
            position: absolute; display: flex; align-items: center; justify-content: center;
            touch-action: none; user-select: none; z-index: 1000;
        }
        .draggable-btn img { pointer-events: none; object-fit: contain; width: 80px; height: 80px; }
        
        #ui-controls { position: fixed; top: 75px; right: 10px; z-index: 10000; }
        .save-btn { padding: 12px; background: #ffd700; border: none; font-weight: bold; border-radius: 8px; color: #000; cursor: pointer; }
        
        #layout-output {
            position: fixed; top: 5%; left: 5%; width: 90%; height: 80%;
            background: #111; color: #0f0; padding: 15px; z-index: 10001;
            display: none; font-family: monospace; border: 2px solid #ffd700; font-size: 10px;
        }
        
        .page-arrow-bottom {
            position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%);
            width: 60px; height: 40px; background: rgba(255,215,0,0.8);
            clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
            z-index: 10000; cursor: pointer;
            display: ${isTablet ? 'none' : 'flex'}; /* СТРОГО: на планшете нет стрелки */
        }
    `;
    document.head.appendChild(style);

    function initLayout() {
        const menu = document.querySelector('#menu-screen .menu-container') || document.body;

        const p1 = document.createElement('div'); p1.id = 'page-1'; p1.className = 'canvas-page active';
        const p2 = document.createElement('div'); p2.id = 'page-2'; p2.className = 'canvas-page';
        
        if (!isTablet) p2.style.transform = 'translateX(100%)';
        menu.appendChild(p1);
        menu.appendChild(p2);

        buttonsData.forEach((data, index) => {
            const btn = document.createElement('div');
            btn.className = 'draggable-btn';
            btn.id = data.id;
            
            // Сетка для планшета: 5 в ряд, 2 ряда
            let cols = isTablet ? 5 : 3;
            btn.style.left = (60 + (index % cols) * 110) + 'px';
            btn.style.top = (150 + Math.floor(index / cols) * 110) + 'px';
            btn.innerHTML = `<img src="${data.img}">`;

            setupTouchEvents(btn);
            
            // Если планшет — всё в P1. Если телефон — делим по 5.
            if (isTablet || index < 5) {
                p1.appendChild(btn);
                btn.dataset.page = "1";
            } else {
                p2.appendChild(btn);
                btn.dataset.page = "2";
            }
        });

        // Стрелка только для телефонов
        if (!isTablet) {
            const arrow = document.createElement('div');
            arrow.className = 'page-arrow-bottom';
            arrow.onclick = () => {
                if (currentPage === 1) {
                    p1.style.transform = 'translateX(-100%)'; p2.style.transform = 'translateX(0)';
                    p1.classList.remove('active'); p2.classList.add('active');
                    currentPage = 2; arrow.style.transform = 'translateX(-50%) rotate(180deg)';
                } else {
                    p1.style.transform = 'translateX(0)'; p2.style.transform = 'translateX(100%)';
                    p2.classList.remove('active'); p1.classList.add('active');
                    currentPage = 1; arrow.style.transform = 'translateX(-50%)';
                }
            };
            document.body.appendChild(arrow);
        }

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn'; saveBtn.innerText = 'СОХРАНИТЬ';
        const controls = document.createElement('div');
        controls.id = 'ui-controls'; controls.appendChild(saveBtn);
        
        const output = document.createElement('textarea');
        output.id = 'layout-output';
        output.onclick = () => output.style.display = 'none';

        saveBtn.onclick = () => {
            const res = [];
            document.querySelectorAll('.draggable-btn').forEach(el => {
                res.push({
                    id: el.id,
                    page: parseInt(el.dataset.page),
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

    function setupTouchEvents(el) {
        let startDist = 0, startSize = 80;
        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                let touch = e.touches[0];
                let sX = touch.clientX - el.offsetLeft;
                let sY = touch.clientY - el.offsetTop;
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
                let newDist = Math.hypot(e.touches[0].pageX-e.touches[1].pageX, e.touches[0].pageY-e.touches[1].pageY);
                let newS = Math.max(30, Math.min(500, startSize * (newDist / startDist)));
                el.querySelector('img').style.width = el.querySelector('img').style.height = newS + 'px';
            }
        });
    }

    initLayout();
})();
