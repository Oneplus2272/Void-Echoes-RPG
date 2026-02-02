(function() {
    let EDIT_MODE = true; 
    let currentPage = 1;

    // Список твоих кнопок (Магазин и Инвентарь удалены)
    const buttonsData = [
        { id: 'profile',   img: 'icon_profile.png',   label: 'Профиль',    page: 1 },
        { id: 'battle',    img: 'icon_battle.png',    label: 'Сражения',   page: 1 },
        { id: 'quests',    img: 'icon_quests.png',    label: 'Задания',    page: 1 },
        { id: 'calendar',  img: 'icon_calendar.png',  label: 'Календарь',  page: 1 },
        { id: 'alliance',  img: 'icon_alliance.png',  label: 'Союз',       page: 1 },
        { id: 'community', img: 'icon_community.png', label: 'Сообщество',  page: 2 },
        { id: 'mail',      img: 'icon_mail.png',      label: 'Письмо',     page: 2 },
        { id: 'rating',    img: 'icon_rating.png',    label: 'Рейтинг',    page: 2 },
        { id: 'benchmark', img: 'icon_benchmark.png', label: 'Эталон',     page: 2 },
        { id: 'lotto',     img: 'icon_lotto.png',     label: 'Лото',       page: 2 }
    ];

    const style = document.createElement('style');
    style.innerHTML = `
        .canvas-page {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            transition: transform 0.5s ease-in-out; pointer-events: none; z-index: 100;
        }
        .canvas-page.active { pointer-events: auto; }
        
        .draggable-btn {
            position: absolute; display: flex; flex-direction: column; align-items: center;
            touch-action: none; user-select: none; z-index: 1000;
        }
        .draggable-btn img { pointer-events: none; object-fit: contain; width: 80px; height: 80px; }
        .draggable-btn span { font-size: 11px; color: #ffd700; font-weight: bold; pointer-events: none; text-shadow: 1px 1px 2px #000; margin-top: 2px; }
        
        #ui-controls { position: fixed; top: 10px; right: 10px; z-index: 10000; }
        .save-btn { padding: 15px; background: #ffd700; border: none; font-weight: bold; border-radius: 8px; color: #000; }
        
        #layout-output {
            position: fixed; top: 5%; left: 5%; width: 90%; height: 80%;
            background: #111; color: #0f0; padding: 15px; z-index: 10001;
            display: none; font-family: monospace; border: 2px solid #ffd700; font-size: 12px;
        }
        
        .page-arrow-bottom {
            position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%);
            width: 60px; height: 40px; background: rgba(255,215,0,0.8);
            clip-path: polygon(50% 100%, 0% 0%, 100% 0%);
            z-index: 10000; cursor: pointer;
        }
        .page-arrow-bottom.up { clip-path: polygon(50% 0%, 0% 100%, 100% 100%); }
    `;
    document.head.appendChild(style);

    function initLayoutEditor() {
        const menu = document.querySelector('#menu-screen .menu-container');
        if (!menu) return;

        const p1 = document.createElement('div'); p1.id = 'page-1'; p1.className = 'canvas-page active';
        const p2 = document.createElement('div'); p2.id = 'page-2'; p2.className = 'canvas-page';
        p2.style.transform = 'translateX(100%)';

        menu.appendChild(p1);
        menu.appendChild(p2);

        buttonsData.forEach((data, index) => {
            const btn = document.createElement('div');
            btn.className = 'draggable-btn';
            btn.id = data.id;
            btn.dataset.page = data.page;
            
            // Начальный разброс, чтобы удобно было брать
            btn.style.left = (40 + (index % 4) * 90) + 'px';
            btn.style.top = (100 + Math.floor(index / 4) * 110) + 'px';

            btn.innerHTML = `<img src="${data.img}"><span>${data.label}</span>`;

            setupTouchEvents(btn);
            if (data.page === 1) p1.appendChild(btn); else p2.appendChild(btn);
        });

        const arrow = document.createElement('div');
        arrow.className = 'page-arrow-bottom';
        arrow.onclick = () => {
            if (currentPage === 1) {
                p1.style.transform = 'translateX(-100%)'; p2.style.transform = 'translateX(0)';
                p1.classList.remove('active'); p2.classList.add('active');
                currentPage = 2; arrow.classList.add('up');
            } else {
                p1.style.transform = 'translateX(0)'; p2.style.transform = 'translateX(100%)';
                p2.classList.remove('active'); p1.classList.add('active');
                currentPage = 1; arrow.classList.remove('up');
            }
        };

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn'; saveBtn.innerText = 'СОХРАНИТЬ КООРДИНАТЫ';
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
        document.body.appendChild(arrow);
        document.body.appendChild(output);
    }

    function setupTouchEvents(el) {
        let startDist = 0, startSize = 80;

        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                let touch = e.touches[0];
                let shiftX = touch.clientX - el.offsetLeft;
                let shiftY = touch.clientY - el.offsetTop;

                function move(ev) {
                    el.style.left = (ev.touches[0].clientX - shiftX) + 'px';
                    el.style.top = (ev.touches[0].clientY - shiftY) + 'px';
                }
                el.addEventListener('touchmove', move);
                el.addEventListener('touchend', () => el.removeEventListener('touchmove', move), {once:true});
            } else if (e.touches.length === 2) {
                startDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                startSize = parseInt(el.querySelector('img').style.width || 80);
            }
        });

        el.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                let newDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                let newSize = Math.max(30, Math.min(400, startSize * (newDist / startDist)));
                el.querySelector('img').style.width = newSize + 'px';
                el.querySelector('img').style.height = newSize + 'px';
            }
        });
    }

    initLayoutEditor();
})();
