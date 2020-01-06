window.jwb = window.jwb || {};

class SoundPlayer {
  context;
  gainNode;
  oscillator;
  
  constructor() {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0.15;
    this.gainNode.connect(this.context.destination);
  }

  _newOscillator() {
    const o = this.context.createOscillator();
    o.type = 'square';
    o.connect(this.gainNode);
    o.isRepeating = false;
    return o;
  }

  play(freq, ms) {
    this.oscillator = this._newOscillator();
    this.oscillator.frequency.value = freq;
    this.oscillator.start();
    this.oscillator.started = true;
    setTimeout(() => this.stop(), ms);
  }
  
  stop() {
    try {
      if (this.oscillator && this.oscillator.started) {
        this.oscillator.stop(0);
        this.oscillator.stopped = true;
      }
    } catch (e) {
      console.error(e);
    }
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
      this.oscillator.started = true;
      this.oscillator.stop(startTime + runtime / 1000);

      const repeat = document.querySelector('input[type=checkbox]').checked;
      if (repeat) {
        const o = this.oscillator;
        o.isRepeating = true;
        setTimeout(() => o.isRepeating && !o.stopped && this.playMulti(freqsAndLengths), runtime);
      }
    }
  }
}
