import { Capacitor } from '@capacitor/core';

const TEST_AD_UNITS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712'
};

class AdMobService {
  constructor() {
    this.isNative = Capacitor.isNativePlatform();
    this.initialized = false;
    this.interstitialReady = false;
    this.admob = null;
  }

  async init() {
    if (!this.isNative) return;
    try {
      const module = await import('@capacitor-community/admob');
      this.admob = module.AdMob;
      this.bannerPosition = module.BannerAdPosition;
      this.bannerSize = module.BannerAdSize;

      await this.admob.initialize({
        requestTrackingAuthorization: true,
        initializeForTesting: true
      });
      this.initialized = true;
      this.preloadInterstitial();
    } catch {
      // Gracefully continue if native AdMob fails
    }
  }

  async preloadInterstitial() {
    if (!this.initialized || !this.admob) return;
    try {
      await this.admob.prepareInterstitial({
        adId: TEST_AD_UNITS.INTERSTITIAL,
        isTesting: true
      });
      this.interstitialReady = true;
    } catch {
      this.interstitialReady = false;
    }
  }

  async showInterstitial() {
    if (!this.initialized || !this.admob) return;
    try {
      if (this.interstitialReady) {
        await this.admob.showInterstitial();
        this.interstitialReady = false;
        this.preloadInterstitial();
      } else {
        await this.preloadInterstitial();
      }
    } catch {
      // Fallback cleanly
    }
  }

  async showBanner() {
    if (!this.initialized || !this.admob) return;
    try {
      await this.admob.showBanner({
        adId: TEST_AD_UNITS.BANNER,
        adSize: this.bannerSize.ADAPTIVE_BANNER,
        position: this.bannerPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true
      });
    } catch {
      // Continue without banner
    }
  }

  async hideBanner() {
    if (!this.initialized || !this.admob) return;
    try {
      await this.admob.hideBanner();
    } catch {
      // Ignore
    }
  }
}

export const admobService = new AdMobService();
