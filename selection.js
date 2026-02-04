let currentHeroId = null;

function selectHero(name, heroId) {
    document.querySelectorAll('.hero-card').forEach(card => card.classList.remove('active'));
    const selectedCard = document.getElementById('c-' + heroId);
    if (selectedCard) selectedCard.classList.add('active');
    
    currentHeroId = heroId;
    const confirmBtn = document.getElementById('final-confirm-btn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = `ПОДТВЕРДИТЬ: ${name}`;
    }
    
    const invHeroImg = document.getElementById('inv-hero-img');
    if (invHeroImg && heroesData[heroId]) {
        invHeroImg.src = heroesData[heroId].image;
    }
}

async function confirmHeroSelection() {
    if (!currentHeroId) return;
    const tg = window.Telegram?.WebApp;
    const userId = tg?.initDataUnsafe?.user?.id || 12345;
    
    try { 
        await fetch(`https://void-echoes-rpg.onrender.com/set_hero/${userId}/${currentHeroId}`, { method: 'POST' }); 
        showMenu(); 
    } catch (e) { 
        showMenu(); 
    }
}
