(function() {
    let EDIT_MODE = true; 
    let currentPage = 1;

    // Список всех твоих иконок
    const buttonsData = [
        { id: 'profile',   img: 'icon_profile.png',   label: 'Профиль', page: 1, x: 50,  y: 50,  size: 80 },
        { id: 'quests',    img: 'icon_quests.png',    label: 'Задания', page: 1, x: 150, y: 50,  size: 80 },
        { id: 'battle',    img: 'icon_battle.png',    label: 'Сражения',page: 1, x: 50,  y: 150, size: 80 },
        { id: 'shop',      img: 'icon_shop.png',      label: 'Магазин', page: 1, x: 150, y: 150, size: 80 },
        { id: 'community', img: 'icon_community.png', label: 'ТГ Союз', page: 1, x: 50,  y: 250, size: 80 },
        { id: 'lotto',     img: 'icon_lotto.png',     label: 'Лото',    page: 2, x: 50,  y: 50,  size: 80 }, // На 2-й странице
        { id: 'rating',    img: 'icon_rating.png',    label: 'Рейтинг', page: 2, x: 150, y: 50,  size: 80 }
    ];

    const style = document.createElement('style');
    style.innerHTML = `
        .canvas-page {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            transition: transform 0.5s ease-in-out; pointer-events: none;
        }
        .canvas-page.active { pointer-events: auto; }
        
        .draggable-btn {
            position: absolute; display: flex; flex-direction: column; align-items: center;
            touch-action: none; user-select: none; z-index: 1000;
        }
        .draggable-btn img { pointer-events: none; object-fit: contain; }
        .draggable-btn span { font-size: 12px; color: #ffd700; font-weight: bold; pointer-events: none; text-shadow: 1px 1px 2px #000; }
        
        #ui-controls { position: fixed; top: 10px; right: 10px; z-index: 10000; display: flex; gap: 10px; }
        .ui-btn { padding: 12px; background: #ffd700; border: none; font-weight: bold; border-radius: 8px; box-shadow: 0 4px 10px #000; }
        
        #layout-output {
            position: fixed; top: 10%; left: 10%; width: 80%; height: 70%;
            background: #000; color: #0f0; padding: 20px; z-index: 10001;
            display: none; font-family: monospace; border: 2px solid #ffd700;
        }
        
        .page-arrow {
            position: fixed; right: 20px; top: 50%; width: 50px; height: 50px;
            background: rgba(255,215,0,0.7); clip-path: polygon(0% 0%, 100% 50%, 0% 100%);
            z-index: 10000; cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    function initFreeLayout() {
        const menu = document.querySelector('#menu-screen .menu-container');
        if (!menu) return;

        // Создаем две страницы (холста)
        const page1 = document.createElement('div');
        page1.id = 'page-1'; page1.className = 'canvas-page active';
        
        const page2 = document.createElement('div');
        page2.id = 'page-2'; page2.className = 'canvas-page';
        page2.style.transform = 'translateX(100%)';

        menu.appendChild(page1);
        menu.appendChild(page2);

        buttonsData.forEach(data => {
            const btn = document.createElement('div');
            btn.className = 'draggable-btn';
            btn.id = data.id;
            btn.style.left = data.x + 'px';
            btn.style.top = data.y + 'px';
            btn.dataset.page = data.page;

            btn.innerHTML = `
                <img src="${data.img}" style="width:${data.size}px; height:${data.size}px;">
                <span>${data.label}</span>
            `;

            if (EDIT_MODE) setupTouchEvents(btn);
            
            if (data.page === 1) page1.appendChild(btn);
            else page2.appendChild(btn);
        });

        // Кнопки управления
        const controls = document.createElement('div');
        controls.id = 'ui-controls';
        
        const saveBtn = document.createElement('button');
        saveBtn.className = 'ui-btn'; saveBtn.innerText = 'СОХРАНИТЬ';
        
        const arrow = document.createElement('div');
        arrow.className = 'page-arrow';
        
        arrow.onclick = () => {
            if (currentPage === 1) {
                page1.style.transform = 'translateX(-100%)';
                page2.style.transform = 'translateX(0)';
                page1.classList.remove('active'); page2.classList.add('active');
                currentPage = 2;
                arrow.style.transform = 'translateY(-50%) rotate(180deg)';
            } else {
                page1.style.transform = 'translateX(0)';
                page2.style.transform = 'translateX(100%)';
                page2.classList.remove('active'); page1.classList.add('active');
                currentPage = 1;
                arrow.style.transform = 'translateY(-50%)';
            }
        };

        const output = document.createElement('textarea');
        output.id = 'layout-output';
        
        saveBtn.onclick = () => {
            const res = [];
            document.querySelectorAll('.draggable-btn').forEach(el => {
                res.push({
                    id: el.id,
                    page: parseInt(el.dataset.page),
                    x: parseInt(el.style.left),
                    y: parseInt(el.style.top),
                    size: parseInt(el.querySelector('img').style.width)
                });
            });
            output.value = "// СКОПИРУЙ ЭТО И ПРИШЛИ МНЕ:\n" + JSON.stringify(res, null, 2);
            output.style.display = 'block';
        };

        controls.appendChild(saveBtn);
        document.body.appendChild(controls);
        document.body.appendChild(arrow);
        document.body.appendChild(output);
    }

    function setupTouchEvents(el) {
        let startDist = 0;
        let startSize = 0;

        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                let touch = e.touches[0];
                let rect = el.getBoundingClientRect();
                let shiftX = touch.clientX - rect.left;
                let shiftY = touch.clientY - rect.top;

                function onTouchMove(ev) {
                    let t = ev.touches[0];
                    el.style.left = (t.clientX - shiftX) + 'px';
                    el.style.top = (t.clientY - shiftY) + 'px';
                }

                el.addEventListener('touchmove', onTouchMove);
                el.addEventListener('touchend', () => el.removeEventListener('touchmove', onTouchMove), {once:true});
            } else if (e.touches.length === 2) {
                startDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                startSize = parseInt(el.querySelector('img').style.width);
            }
        });

        el.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                let newDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                let zoom = newDist / startDist;
                let newSize = Math.max(30, Math.min(300, startSize * zoom));
                el.querySelector('img').style.width = newSize + 'px';
                el.querySelector('img').style.height = newSize + 'px';
            }
        });
    }

    initFreeLayout();
})();
