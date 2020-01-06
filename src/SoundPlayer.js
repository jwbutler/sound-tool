window.jwb = window.jwb || {};

class SoundPlayer {
  context;
  gainNode;
  oscillator;
  started;
  isRepeating;
  
  constructor() {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0.15;
    this.gainNode.connect(this.context.destination);
    this.isRepeating = false;
  }

  _newOscillator() {
    const o = this.context.createOscillator();
    o.type = 'square';
    o.connect(this.gainNode);
    return o;
  }

  play(freq, ms) {
    this.oscillator = this._newOscillator();
    this.oscillator.frequency.value = freq;
    this.oscillator.start();
    this.started = true;
    setTimeout(() => this.stop(), ms);
  }
  
  stop() {
    try {
      this.oscillator && this.started && this.oscillator.stop(0);
    } catch (e) {
      console.error(e);
    }
    this.isRepeating = false;
  }

  /**
   * @param freqsAndLengths An array of [freq, ms]
   */
  playMulti(freqsAndLengths) {
    this.stop();
    this.oscillator = this._newOscillator();
    if (freqsAndLengths.length) {
      const startTime = this.context.currentTime;
      let nextStartTime = startTime;
      for (let i = 0; i < freqsAndLengths.length; i++) {
        const [freq, ms] = freqsAndLengths[i];
        this.oscillator.frequency.setValueAtTime(freq, nextStartTime);
        nextStartTime += ms / 1000;
      }
      const runtime = freqsAndLengths.map(([freq, ms]) => ms).reduce((a, b) => a + b);
      this.oscillator.start();
      this.started = true;
      this.oscillator.stop(startTime + runtime / 1000);

      const repeat = document.querySelector('input[type=checkbox]').checked;
      if (repeat) {
        setTimeout(() => this.isRepeating && this.playMulti(freqsAndLengths), runtime);
        this.isRepeating = true;
      }
    }
  }
}
