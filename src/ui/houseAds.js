const AD_VARIANTS = [
  {
    iconSrc: '/assets/ads/elorun-icon.webp',
    title: 'EloRun: Chess Puzzles',
    tagline: '100K+ puzzles, level up your tactics!',
    badge: '♟️ Free Chess Trainer',
    cta: 'PLAY',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.EloRun',
    ctaBg: 'linear-gradient(135deg, #f59e0b, #d97706)'
  },
  {
    iconSrc: '/assets/ads/zencash-icon.webp',
    title: 'ZenCash: Master Money',
    tagline: 'Wealth projections & budget manager',
    badge: '💰 Smart Expense Suite',
    cta: 'GET',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.fintrack',
    ctaBg: 'linear-gradient(135deg, #10b981, #059669)'
  },
  {
    iconSrc: '/assets/ads/elorun-icon.webp',
    title: 'EloRun: Brain Trainer',
    tagline: 'Climb the Global EloBoard today!',
    badge: '🏆 112,000+ Master Puzzles',
    cta: 'SOLVE',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.EloRun',
    ctaBg: 'linear-gradient(135deg, #ef4444, #dc2626)'
  },
  {
    iconSrc: '/assets/ads/zencash-icon.webp',
    title: 'ZenCash: Finance Suite',
    tagline: 'Take absolute control of your cash flow',
    badge: '📈 Precision Wealth Growth',
    cta: 'INSTALL',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.fintrack',
    ctaBg: 'linear-gradient(135deg, #3b82f6, #2563eb)'
  }
];

let currentIdx = 0;

export function renderHouseAd(container) {
  if (!container) return;
  const ad = AD_VARIANTS[currentIdx % AD_VARIANTS.length];

  container.innerHTML = `
    <a href="${ad.url}" target="_blank" rel="noopener noreferrer" class="house-ad-card" aria-label="${ad.title}">
      <img src="${ad.iconSrc}" alt="${ad.title}" class="house-ad-icon-img" width="44" height="44" loading="lazy" />
      <div class="house-ad-info">
        <div class="house-ad-title">${ad.title}</div>
        <div class="house-ad-tagline">${ad.tagline}</div>
        <div class="house-ad-rating">${ad.badge}</div>
      </div>
      <div class="house-ad-cta" style="background: ${ad.ctaBg}">${ad.cta} →</div>
    </a>
  `;
}

export function initHouseAds() {
  const placeholders = document.querySelectorAll('.ad-placeholder');
  if (!placeholders || placeholders.length === 0) return;

  const updateAll = () => {
    placeholders.forEach((el) => renderHouseAd(el));
    currentIdx++;
  };

  updateAll();
  setInterval(updateAll, 8000);
}
