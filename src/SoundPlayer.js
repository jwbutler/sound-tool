window.jwb = window.jwb || {};

class SoundPlayer {
  context;
  gainNode;
  
  constructor() {
    this.context = new AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = 0.15;
    this.gainNode.connect(this.context.destination);
  }

  play(freq, ms) {
    const o = this.context.createOscillator();
    o.type = 'square';
    o.frequency.value = freq;
    o.connect(this.gainNode);
    o.start();
    setTimeout(() => o.stop(), ms);
  }
  
  stop() {
    if (this.context) {
      this.context.close();
    }
    this.context = null;
  }

  /**
   * @param freqsAndLengths An array of [freq, ms]
   */
  playMulti(freqsAndLengths) {
    if (freqsAndLengths.length) {
      const o = this.context.createOscillator();
      o.type = 'square';
      const startTime = this.context.currentTime;
      let nextStartTime = startTime;
      for (let i = 0; i < freqsAndLengths.length; i++) {
        const [freq, ms] = freqsAndLengths[i];
        o.frequency.setValueAtTime(freq, nextStartTime);
        nextStartTime += ms / 1000;
      }
      o.connect(this.gainNode);
      const runtime = freqsAndLengths.map(([freq, ms]) => ms).reduce((a, b) => a + b);
      o.start();
      o.stop(startTime + runtime / 1000);
    }
  }
}
