window.jwb = window.jwb || {};

{
  let _context = null;
  let _gainNode = null;
  
  const _initialize = () => {
    if (!_context) {
      _context = new AudioContext();
      _gainNode = _context.createGain();
      _gainNode.gain.value = 0.15;
      _gainNode.connect(_context.destination);
    }
  };

  const _play = (freq, length) => {
    if (!_context) {
      _initialize();
    }
    const o = _context.createOscillator(); 
    o.type = 'square';
    o.frequency.value = freq;
    o.connect(_gainNode);
    o.start();
    setTimeout(() => o.stop(), length);
  };
  
  const stop = () => {
    if (_context) {
      _context.close();
    }
    _context = null;
  };

  /**
   * @param freqsAndLengths An array of [freq, ms]
   */
  const playMulti = (freqsAndLengths) => {
    if (freqsAndLengths.length) {
      if (!_context) {
        _initialize();
      }
      const o = _context.createOscillator(); 
      o.type = 'square';
      const startTime = _context.currentTime;
      let nextStartTime = startTime;
      for (let i = 0; i < freqsAndLengths.length; i++) {
        const [freq, ms] = freqsAndLengths[i];
        o.frequency.setValueAtTime(freq, nextStartTime);
        nextStartTime += ms / 1000;
      }
      o.connect(_gainNode);
      const runtime = freqsAndLengths.map(([freq, ms]) => ms).reduce((a, b) => a + b);
      o.start();
      o.stop(startTime + runtime / 1000);
    }
  };
  
  jwb.audio = { playMulti, stop };
}
