import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

class HapticManager {
  constructor() {
    this.isNative = typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
  }

  async trigger(type) {
    if (this.isNative) {
      try {
        switch (type) {
          case 'drop':
            await Haptics.impact({ style: ImpactStyle.Light });
            return;
          case 'merge':
            await Haptics.impact({ style: ImpactStyle.Medium });
            return;
          case 'milestone':
            await Haptics.notification({ type: NotificationType.Success });
            return;
          case 'gameover':
            await Haptics.notification({ type: NotificationType.Warning });
            return;
          default:
            await Haptics.impact({ style: ImpactStyle.Light });
            return;
        }
      } catch {
        // Fall back to web vibration if native haptics fails
      }
    }

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        switch (type) {
          case 'drop':
            navigator.vibrate(15);
            break;
          case 'merge':
            navigator.vibrate(35);
            break;
          case 'milestone':
            navigator.vibrate([40, 60, 40, 60, 80]);
            break;
          case 'gameover':
            navigator.vibrate([100, 50, 200]);
            break;
          default:
            navigator.vibrate(15);
            break;
        }
      } catch {
        // Vibration blocked or unsupported
      }
    }
  }
}

export const hapticManager = new HapticManager();
