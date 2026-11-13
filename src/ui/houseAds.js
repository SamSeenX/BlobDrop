const AD_VARIANTS = [
  {
    icon: '🏃',
    title: 'EloRun: Color Rush',
    tagline: 'Match colors & dash through traps!',
    rating: '★ 5.0 on Google Play',
    cta: 'PLAY',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.EloRun',
    iconBg: 'linear-gradient(135deg, #f43f5e, #fb7185)',
    ctaBg: 'linear-gradient(135deg, #f43f5e, #e11d48)'
  },
  {
    icon: '💰',
    title: 'FinTrack: Expense Tracker',
    tagline: 'Track spending & budget offline!',
    rating: '★ 5.0 on Google Play',
    cta: 'GET',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.fintrack',
    iconBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    ctaBg: 'linear-gradient(135deg, #10b981, #059669)'
  },
  {
    icon: '⚡',
    title: 'Love BlobDrop? Try EloRun!',
    tagline: 'Fast-paced viral arcade runner',
    rating: '★ 5.0 • Free on Play Store',
    cta: 'INSTALL',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.EloRun',
    iconBg: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    ctaBg: 'linear-gradient(135deg, #ec4899, #be185d)'
  },
  {
    icon: '📊',
    title: 'FinTrack: Smart Money',
    tagline: 'Private, secure budget manager',
    rating: '★ 5.0 • Highly Rated',
    cta: 'OPEN',
    url: 'https://play.google.com/store/apps/details?id=com.samseen.fintrack',
    iconBg: 'linear-gradient(135deg, #6366f1, #3b82f6)',
    ctaBg: 'linear-gradient(135deg, #6366f1, #4f46e5)'
  }
];

let currentIdx = 0;

export function renderHouseAd(container) {
  if (!container) return;
  const ad = AD_VARIANTS[currentIdx % AD_VARIANTS.length];

  container.innerHTML = `
    <a href="${ad.url}" target="_blank" rel="noopener noreferrer" class="house-ad-card" aria-label="${ad.title}">
      <div class="house-ad-icon" style="background: ${ad.iconBg}">${ad.icon}</div>
      <div class="house-ad-info">
        <div class="house-ad-title">${ad.title}</div>
        <div class="house-ad-tagline">${ad.tagline}</div>
        <div class="house-ad-rating">${ad.rating}</div>
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
