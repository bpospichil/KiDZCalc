// Offline Web Audio API Synthesizer & Sound Effects for KidZCalc

class AudioEngine {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private sfxGainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicPlaying: boolean = false;
  private musicTimer: number | null = null;
  private currentTrack: string = 'chiptune1';

  constructor() {
    // Lazy init audio context on user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.musicGainNode = this.ctx.createGain();
      this.musicGainNode.gain.value = 0.15; // Pleasant background level
      this.musicGainNode.connect(this.ctx.destination);

      this.sfxGainNode = this.ctx.createGain();
      this.sfxGainNode.gain.value = 0.3; // Responsive SFX level
      this.sfxGainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.sfxGainNode && this.musicGainNode) {
      this.sfxGainNode.gain.value = muted ? 0 : 0.3;
      this.musicGainNode.gain.value = muted ? 0 : 0.15;
    }
  }

  public triggerHaptic(ms: number | number[] = 35) {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch {
        // Safe fallback if vibration permission isn't allowed in iframe
      }
    }
  }

  // --- Sound Effects ---

  public playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    this.triggerHaptic(20);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  public playClear() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    this.triggerHaptic(40);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  public playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    this.triggerHaptic([40, 30, 60]);

    // Happy 8-bit victory arpeggio: C5 -> E5 -> G5 -> C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.07);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.07 + 0.18);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(this.ctx.currentTime + index * 0.07);
      osc.stop(this.ctx.currentTime + index * 0.07 + 0.18);
    });
  }

  public playError() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    this.triggerHaptic([80, 50, 80]);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.setValueAtTime(140, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.sfxGainNode);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  public playLevelUp() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGainNode) return;

    this.triggerHaptic([50, 50, 50, 100]);

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      if (!this.ctx || !this.sfxGainNode) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = index % 2 === 0 ? 'square' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.06);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGainNode);

      osc.start(this.ctx.currentTime + index * 0.06);
      osc.stop(this.ctx.currentTime + index * 0.06 + 0.25);
    });
  }

  // --- Synthesized Chiptune Music Engine ---
  private trackList = [
    { id: 'chiptune1', name: 'Pixel Bounce', tempoMs: 160, waveform: 'triangle' as OscillatorType,
      melody: [
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 392.00,
        293.66, 349.23, 440.00, 587.33, 440.00, 349.23, 293.66, 440.00,
        329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63, 523.25,
        392.00, 349.23, 329.63, 293.66, 261.63, 329.63, 392.00, 523.25
      ]
    },
    { id: 'chiptune2', name: 'Star Runner', tempoMs: 130, waveform: 'square' as OscillatorType,
      melody: [
        523.25, 659.25, 783.99, 659.25, 523.25, 392.00, 523.25, 659.25,
        587.33, 698.46, 880.00, 698.46, 587.33, 440.00, 587.33, 698.46,
        659.25, 783.99, 1046.50, 783.99, 659.25, 523.25, 659.25, 783.99,
        523.25, 392.00, 329.63, 261.63, 329.63, 392.00, 523.25, 783.99
      ]
    },
    { id: 'chiptune3', name: 'Math Quest', tempoMs: 150, waveform: 'sawtooth' as OscillatorType,
      melody: [
        392.00, 392.00, 523.25, 523.25, 659.25, 659.25, 783.99, 659.25,
        587.33, 587.33, 698.46, 698.46, 880.00, 783.99, 698.46, 587.33,
        523.25, 659.25, 783.99, 1046.50, 880.00, 783.99, 659.25, 523.25,
        440.00, 523.25, 659.25, 587.33, 523.25, 392.00, 440.00, 523.25
      ]
    },
    { id: 'chiptune4', name: 'Candy Castle', tempoMs: 170, waveform: 'triangle' as OscillatorType,
      melody: [
        329.63, 440.00, 523.25, 659.25, 523.25, 440.00, 329.63, 440.00,
        349.23, 440.00, 587.33, 698.46, 587.33, 440.00, 349.23, 440.00,
        392.00, 523.25, 659.25, 783.99, 659.25, 523.25, 392.00, 523.25,
        261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 329.63
      ]
    }
  ];

  private currentTrackIndex: number = 0;

  public startMusic(trackId?: string) {
    if (trackId) {
      const idx = this.trackList.findIndex(t => t.id === trackId);
      if (idx !== -1) this.currentTrackIndex = idx;
    }

    const trackObj = this.trackList[this.currentTrackIndex];
    this.currentTrack = trackObj.id;

    this.initContext();
    if (this.isMusicPlaying) {
      this.stopMusic();
    }

    this.isMusicPlaying = true;
    let step = 0;

    this.musicTimer = window.setInterval(() => {
      if (!this.isMusicPlaying || this.isMuted || !this.ctx || !this.musicGainNode) return;

      const freq = trackObj.melody[step % trackObj.melody.length];
      step++;

      // Synth Note
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = trackObj.waveform;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(noteGain);
      noteGain.connect(this.musicGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);

      // Bass drone on 1st beat of every 4
      if (step % 4 === 1) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'square';
        bassOsc.frequency.setValueAtTime(freq / 4, this.ctx.currentTime);

        bassGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        bassGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

        bassOsc.connect(bassGain);
        bassGain.connect(this.musicGainNode);

        bassOsc.start();
        bassOsc.stop(this.ctx.currentTime + 0.25);
      }
    }, trackObj.tempoMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  // Toggles music. If turning ON, cycles to the NEXT song automatically!
  public toggleMusic(): { isPlaying: boolean; trackName: string } {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return { isPlaying: false, trackName: 'Off' };
    } else {
      // Advance to next song when turning back on!
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.trackList.length;
      this.startMusic(this.trackList[this.currentTrackIndex].id);
      return { isPlaying: true, trackName: this.trackList[this.currentTrackIndex].name };
    }
  }

  public getCurrentTrackName(): string {
    return this.trackList[this.currentTrackIndex].name;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }
}

export const audioEngine = new AudioEngine();
