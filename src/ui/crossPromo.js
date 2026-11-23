const PROMO_VARIANTS = [
  {
    iconSrc: '/assets/promo/elorun-icon.webp',
    title: 'EloRun: Chess Puzzles',
    tagline: '100K+ puzzles, level up your tactics!',
    badge: '♟️ Free Chess Trainer',
    cta: 'PLAY',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.EloRun',
    ctaBg: 'linear-gradient(135deg, #f59e0b, #d97706)'
  },
  {
    iconSrc: '/assets/promo/zencash-icon.webp',
    title: 'ZenCash: Master Money',
    tagline: 'Wealth projections & budget manager',
    badge: '💰 Smart Expense Suite',
    cta: 'GET',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.fintrack',
    ctaBg: 'linear-gradient(135deg, #10b981, #059669)'
  },
  {
    iconSrc: '/assets/promo/elorun-icon.webp',
    title: 'EloRun: Brain Trainer',
    tagline: 'Climb the Global EloBoard today!',
    badge: '🏆 112,000+ Master Puzzles',
    cta: 'SOLVE',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.EloRun',
    ctaBg: 'linear-gradient(135deg, #ef4444, #dc2626)'
  },
  {
    iconSrc: '/assets/promo/zencash-icon.webp',
    title: 'ZenCash: Finance Suite',
    tagline: 'Take absolute control of your cash flow',
    badge: '📈 Precision Wealth Growth',
    cta: 'INSTALL',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.fintrack',
    ctaBg: 'linear-gradient(135deg, #3b82f6, #2563eb)'
  }
];

let currentIdx = 0;

export function renderCrossPromo(container) {
  if (!container) return;
  const promo = PROMO_VARIANTS[currentIdx % PROMO_VARIANTS.length];

  container.innerHTML = `
    <a href="${promo.url}" target="_blank" rel="noopener noreferrer" class="cross-promo-card" aria-label="${promo.title}">
      <img src="${promo.iconSrc}" alt="${promo.title}" class="cross-promo-icon-img" width="44" height="44" loading="lazy" />
      <div class="cross-promo-info">
        <div class="cross-promo-title">${promo.title}</div>
        <div class="cross-promo-tagline">${promo.tagline}</div>
        <div class="cross-promo-rating">${promo.badge}</div>
      </div>
      <div class="cross-promo-cta" style="background: ${promo.ctaBg}">${promo.cta} →</div>
    </a>
  `;
}

export function initCrossPromo() {
  const placeholders = document.querySelectorAll('.promo-placeholder');
  if (!placeholders || placeholders.length === 0) return;

  const updateAll = () => {
    placeholders.forEach((el) => renderCrossPromo(el));
    currentIdx++;
  };

  updateAll();
  setInterval(updateAll, 8000);
}
