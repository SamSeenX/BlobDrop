const ELORUN_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.samseen.elorun';

const AD_VARIANTS = [
  {
    icon: '🏃',
    title: 'EloRun: Color Rush',
    tagline: 'Match colors and dash through traps!',
    rating: '★ 5.0 on Google Play',
    cta: 'PLAY'
  },
  {
    icon: '⚡',
    title: 'Play EloRun Now!',
    tagline: 'Fast-paced arcade runner by SamSeen',
    rating: '★ 5.0 • Free on Play Store',
    cta: 'GET'
  },
  {
    icon: '🎮',
    title: 'Love BlobDrop?',
    tagline: 'Try EloRun, the next viral arcade rush!',
    rating: '★ 5.0 • Over 10k Players',
    cta: 'OPEN'
  }
];

let currentIdx = 0;

export function renderHouseAd(container) {
  if (!container) return;
  const ad = AD_VARIANTS[currentIdx % AD_VARIANTS.length];

  container.innerHTML = `
    <a href="${ELORUN_PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" class="house-ad-card" aria-label="${ad.title}">
      <div class="house-ad-icon">${ad.icon}</div>
      <div class="house-ad-info">
        <div class="house-ad-title">${ad.title}</div>
        <div class="house-ad-tagline">${ad.tagline}</div>
        <div class="house-ad-rating">${ad.rating}</div>
      </div>
      <div class="house-ad-cta">${ad.cta} →</div>
    </a>
  `;
}

export function initHouseAds() {
  const placeholders = document.querySelectorAll('.ad-placeholder');
  if (!placeholders || placeholders.length === 0) return;

  const updateAll = () => {
    placeholders.forEach(el => renderHouseAd(el));
    currentIdx++;
  };

  updateAll();
  setInterval(updateAll, 8000);
}
