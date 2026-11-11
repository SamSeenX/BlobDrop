const STORAGE_KEYS = {
  HIGH_SCORE: 'blobdrop_highscore',
  SOUND_ENABLED: 'blobdrop_sound',
  GAME_STATE: 'blobdrop_gamestate'
};

export const storage = {
  async initPersistence() {
    try {
      if (navigator.storage && navigator.storage.persist) {
        await navigator.storage.persist();
      }
    } catch {
      // Ignored if unsupported or rejected
    }
  },

  getHighScore() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  setHighScore(val) {
    try {
      localStorage.setItem(STORAGE_KEYS.HIGH_SCORE, String(val));
    } catch {
      // Quota exceeded
    }
  },

  getSoundEnabled() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
      return val === null ? true : val === 'true';
    } catch {
      return true;
    }
  },

  setSoundEnabled(enabled) {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
    } catch {
      // Storage unavailable
    }
  },

  getGameState() {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },

  setGameState(state) {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(state));
    } catch {
      // Storage unavailable
    }
  },

  clearGameState() {
    try {
      localStorage.removeItem(STORAGE_KEYS.GAME_STATE);
    } catch {
      // Storage unavailable
    }
  }
};
