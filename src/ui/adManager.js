import { Capacitor } from '@capacitor/core';
import { initHouseAds } from './houseAds.js';
import { admobService } from './admobService.js';
import { eventBus } from '../core/eventBus.js';

export function initAdSystem() {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    admobService.init();
    admobService.showBanner();

    eventBus.on('milestone:unlocked', () => {
      admobService.showInterstitial();
    });

    eventBus.on('game:over', () => {
      admobService.showInterstitial();
    });
  } else {
    initHouseAds();
  }
}
