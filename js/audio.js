// iOS-inspired Web Audio Engine: Procedural Ambient Music & Tactile UI Sound FX
// Zero external audio dependencies - 100% reliable, zero CORS issues, instant playback.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlayingMusic = false;
    this.soundEffectsEnabled = true;
    this.musicVolume = 0.65;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.ambientTimer = null;
    this.musicStep = 0;
    this.playbackTime = 46; // Initial match with Bon Iver screenshot (0:46)
    this.totalDuration = 184; // 3:04 total
    this.tickerInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.35;
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play subtle tactile iOS-style tap/click
  playTap(pitch = 800) {
    if (!this.soundEffectsEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2400, this.ctx.currentTime);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch (e) {
      console.warn("Audio tap error:", e);
    }
  }

  // Play iOS-like toggle switch sound (up or down)
  playToggle(isOn) {
    if (!this.soundEffectsEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      if (isOn) {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      } else {
        osc.frequency.setValueAtTime(740, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
      }

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn("Toggle sound error:", e);
    }
  }

  // Procedural warm Bon Iver / Lo-fi ambient chord progression
  playAmbientChord() {
    if (!this.isPlayingMusic || !this.ctx) return;

    // F# minor - D maj7 - A maj9 - E sus progression (peaceful Bon Iver vibes)
    const chords = [
      [185.00, 277.18, 369.99, 440.00, 554.37], // F#m7
      [146.83, 220.00, 293.66, 369.99, 440.00], // Dmaj7
      [220.00, 277.18, 329.63, 440.00, 659.25], // Amaj9
      [164.81, 246.94, 329.63, 369.99, 493.88]  // Eadd9
    ];

    const currentChord = chords[this.musicStep % chords.length];
    this.musicStep++;

    const now = this.ctx.currentTime;
    const duration = 3.6;

    currentChord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Soft warm filtered sound with slight detune
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900 + idx * 250, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + duration);

      const delayOffset = idx * 0.06;
      gain.gain.setValueAtTime(0.0001, now + delayOffset);
      gain.gain.linearRampToValueAtTime(0.06 / (idx + 1), now + delayOffset + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now + delayOffset);
      osc.stop(now + duration);
    });

    // Schedule next chord
    this.ambientTimer = setTimeout(() => {
      if (this.isPlayingMusic) {
        this.playAmbientChord();
      }
    }, 3200);
  }

  toggleMusic(onUpdateCallback) {
    this.init();
    if (this.isPlayingMusic) {
      this.pauseMusic();
      if (onUpdateCallback) onUpdateCallback(false, this.playbackTime, this.totalDuration);
      return false;
    } else {
      this.startMusic();
      if (onUpdateCallback) onUpdateCallback(true, this.playbackTime, this.totalDuration);
      return true;
    }
  }

  startMusic() {
    this.isPlayingMusic = true;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
    this.playAmbientChord();

    // Start progress timer
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    this.tickerInterval = setInterval(() => {
      this.playbackTime++;
      if (this.playbackTime >= this.totalDuration) {
        this.playbackTime = 0;
      }
      window.dispatchEvent(new CustomEvent('musicTimeUpdate', {
        detail: {
          currentTime: this.playbackTime,
          duration: this.totalDuration,
          progress: (this.playbackTime / this.totalDuration) * 100
        }
      }));
    }, 1000);
  }

  pauseMusic() {
    this.isPlayingMusic = false;
    if (this.ambientTimer) clearTimeout(this.ambientTimer);
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    }
  }

  seek(percentage) {
    this.playbackTime = Math.floor((percentage / 100) * this.totalDuration);
    window.dispatchEvent(new CustomEvent('musicTimeUpdate', {
      detail: {
        currentTime: this.playbackTime,
        duration: this.totalDuration,
        progress: (this.playbackTime / this.totalDuration) * 100
      }
    }));
  }

  setVolume(val) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }
}

window.audioEngine = new AudioEngine();
