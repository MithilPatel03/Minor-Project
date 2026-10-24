// Sync service across browser tabs using BroadcastChannel & Web Audio Alerts

const CHANNEL_NAME = 'eazyorder_sync_v1';
let channel = null;

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel(CHANNEL_NAME);
  } catch (e) {
    console.warn('BroadcastChannel not available:', e);
  }
}

export const subscribeToSync = (callback) => {
  const listener = (event) => {
    if (event.data && callback) {
      callback(event.data);
    }
  };

  if (channel) {
    channel.addEventListener('message', listener);
  }

  // Fallback to storage event for older browsers / cross-window backup
  const storageListener = (e) => {
    if (e.key === 'eazyorder_sync_trigger') {
      try {
        const payload = JSON.parse(e.newValue);
        if (payload && callback) {
          callback(payload);
        }
      } catch (err) {
        // ignore parse error
      }
    }
  };

  window.addEventListener('storage', storageListener);

  return () => {
    if (channel) {
      channel.removeEventListener('message', listener);
    }
    window.removeEventListener('storage', storageListener);
  };
};

export const broadcastState = (actionType, payload) => {
  const message = { type: actionType, payload, timestamp: Date.now() };
  
  if (channel) {
    channel.postMessage(message);
  }

  // Trigger storage event for tabs listening to storage
  try {
    localStorage.setItem('eazyorder_sync_trigger', JSON.stringify(message));
  } catch (e) {
    // ignore
  }
};

// Web Audio API Synthesizer Chime
export const playKitchenBell = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // High clear double chime (880Hz A5 + 1320Hz E6)
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc2.frequency.setValueAtTime(1320, ctx.currentTime);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 1.2);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.warn('Audio play error:', e);
  }
};

export const playWaiterAlert = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.8);
  } catch (e) {
    console.warn('Audio waiter alert error:', e);
  }
};
