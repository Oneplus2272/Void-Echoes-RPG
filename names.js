(function() {
    let EDIT_MODE = true; 
    
    const buttonsData = [
        { id: 'profile', img: 'icon_profile.png', label: 'Профиль', x: 20, y: 10, size: 80 },
        { id: 'quests', img: 'icon_quests.png', label: 'Задания', x: 120, y: 10, size: 80 },
        { id: 'battle', img: 'icon_battle.png', label: 'Сражения', x: 220, y: 10, size: 80 },
        { id: 'shop', img: 'icon_shop.png', label: 'Магазин', x: 320, y: 10, size: 80 },
        { id: 'community', img: 'icon_community.png', label: 'ТГ Союз', x: 420, y: 10, size: 80 },
        { id: 'lotto', img: 'icon_lotto.png', label: 'Лото', x: 520, y: 10, size: 80 }
    ];

    const style = document.createElement('style');
    style.innerHTML = `
        .nav-wrapper-container {
            position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
            width: 95%; height: 160px; background: rgba(255, 255, 255, 0.05);
            border: 2px dashed rgba(255, 215, 0, 0.5); border-radius: 20px;
            z-index: 1000; overflow: hidden;
        }
        .scroll-viewport {
            width: 100%; height: 100%; overflow-x: auto; position: relative;
            padding-right: 60px; -webkit-overflow-scrolling: touch;
        }
        .arrow-next {
            position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
            width: 40px; height: 40px; background: var(--gold, #ffd700);
            clip-path: polygon(0% 0%, 100% 50%, 0% 100%); z-index: 1001;
        }
        .draggable-btn {
            position: absolute; display: flex; flex-direction: column; align-items: center;
            touch-action: none; user-select: none;
        }
        .draggable-btn img { pointer-events: none; object-fit: contain; }
        .draggable-btn span { font-size: 12px; color: #ffd700; font-weight: bold; pointer-events: none; }
        
        #layout-output {
            position: fixed; top: 10%; left: 10%; width: 80%; height: 70%;
            background: #000; color: #0f0; padding: 20px; z-index: 10000;
            display: none; font-family: monospace; border: 2px solid #ffd700;
        }
    `;
    document.head.appendChild(style);

    function initTabletNav() {
        const menu = document.querySelector('#menu-screen .menu-container');
        if (!menu) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'nav-wrapper-container';
        const viewport = document.createElement('div');
        viewport.className = 'scroll-viewport';
        
        const arrow = document.createElement('div');
        arrow.className = 'arrow-next';
        arrow.onclick = () => viewport.scrollBy({ left: 200, behavior: 'smooth' });

        buttonsData.forEach(data => {
            const btn = document.createElement('div');
            btn.className = 'draggable-btn';
            btn.id = data.id;
            btn.style.left = data.x + 'px';
            btn.style.top = data.y + 'px';
            btn.innerHTML = `<img src="${data.img}" style="width:${data.size}px; height:${data.size}px;"><span>${data.label}</span>`;

            if (EDIT_MODE) setupTouchEvents(btn);
            viewport.appendChild(btn);
        });

        wrapper.appendChild(viewport);
        wrapper.appendChild(arrow);
        menu.appendChild(wrapper);

        // Кнопка сохранения для планшета
        const sBtn = document.createElement('button');
        sBtn.innerText = 'СОХРАНИТЬ РАССТАНОВКУ';
        Object.assign(sBtn.style, { position:'fixed', top:'10px', right:'10px', zIndex:'10001', padding:'15px', background:'#ffd700', fontWeight:'bold' });
        
        const output = document.createElement('textarea');
        output.id = 'layout-output';
        
        sBtn.onclick = () => {
            const res = [];
            document.querySelectorAll('.draggable-btn').forEach(el => {
                res.push({ id: el.id, x: parseInt(el.style.left), y: parseInt(el.style.top), size: parseInt(el.querySelector('img').style.width) });
            });
            output.value = JSON.stringify(res, null, 2);
            output.style.display = 'block';
            alert("Скопируй текст из появившегося окна и пришли мне!");
        };

        document.body.appendChild(sBtn);
        document.body.appendChild(output);
    }

    function setupTouchEvents(el) {
        let currentScale = 1;
        let startDist = 0;
        let startSize = 0;

        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 1) {
                // Перетаскивание
                let touch = e.touches[0];
                let shiftX = touch.clientX - el.getBoundingClientRect().left;
                let shiftY = touch.clientY - el.getBoundingClientRect().top;

                function moveAt(t) {
                    el.style.left = (t.clientX - shiftX - el.parentElement.getBoundingClientRect().left) + 'px';
                    el.style.top = (t.clientY - shiftY - el.parentElement.getBoundingClientRect().top) + 'px';
                }

                function onTouchMove(ev) { moveAt(ev.touches[0]); }
                el.addEventListener('touchmove', onTouchMove);
                el.addEventListener('touchend', () => el.removeEventListener('touchmove', onTouchMove), {once:true});

            } else if (e.touches.length === 2) {
                // Изменение размера (Pinch)
                startDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                startSize = parseInt(el.querySelector('img').style.width);
            }
        });

        el.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2) {
                let newDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
                let zoom = newDist / startDist;
                let newSize = Math.max(40, Math.min(200, startSize * zoom));
                el.querySelector('img').style.width = newSize + 'px';
                el.querySelector('img').style.height = newSize + 'px';
            }
        });
    }

    initTabletNav();
})();
