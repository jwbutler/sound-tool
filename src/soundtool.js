window.jwb = window.jwb || {};

{
  function addRow(freq, ms) {
    const tbody = document.querySelector('table#soundtable tbody');
    const rowNumber = _getMaxRowNumber() + 1;
    const tr = document.createElement('tr');
    tr.id = `row${rowNumber}`;
    tbody.appendChild(tr);
    {
      const td = document.createElement('td');
      tr.appendChild(td);
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'freq';
      input.onchange = _onChange;
      input.onkeydown = _suppressEnter;
      input.value = freq;
      input.contentEditable = 'true';
      td.appendChild(input);
    }
    {
      const td = document.createElement('td');
      tr.appendChild(td);
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'ms';
      input.onchange = _onChange;
      input.onkeydown = _suppressEnter;
      input.value = ms;
      input.contentEditable = 'true';
      td.appendChild(input);
    }
    {
      const td = document.createElement('td');
      tr.appendChild(td);
      const button = document.createElement('button');
      button.innerHTML = 'Delete';
      button.onclick = () => removeRow(rowNumber);
      button.tabIndex = -1;
      td.appendChild(button);
    }
    _updateDocumentLocation();
  }

  function init() {
    // TODO needs lots of validation
    const query = document.location.href.split('?')[1];
    if (query) {
      const match = query.match(/freqs=([0-9,\[\]]+)/);
      if (match) {
        const freqsAndLengths = JSON.parse(match[1]);
        for (let [freq, ms] of freqsAndLengths) {
          addRow(freq, ms);
        }

        return;
      }
    }
    addRows(10);
  }
  
  function _getMaxRowNumber() {
    const tbody = document.querySelector('table#soundtable tbody');
    const rowNumbers = Array.prototype.map.call(tbody.children, row => row.id.match('[0-9]+')[0]);
    return rowNumbers.length ? Math.max(...rowNumbers) : null;
  }
  
  function addRows(numRows) {
    for (let i = 0; i < numRows; i++) {
      addRow(null, null);
    }
  }
  
  function _getFreqsAndLengths() {
    const tbody = document.querySelector('table#soundtable tbody');
    const freqsAndLengths = [];
    for (let i = 0; i < tbody.children.length; i++) {
      const row = tbody.children[i];
      const freq = parseInt(row.querySelector('.freq').value) || 0;
      const ms = parseInt(row.querySelector('.ms').value);
      if (ms) {
        freqsAndLengths.push([freq, ms]);
      }
    }
    return freqsAndLengths;
  }

  function play() {
    const freqsAndLengths = _getFreqsAndLengths();
    jwb.audio.playMulti(freqsAndLengths);
  }
  
  function removeRow(rowNumber) {
    console.log(rowNumber);
    const row = document.getElementById(`row${rowNumber}`);
    row.parentElement.removeChild(row);
    _updateDocumentLocation();
  }
  
  function clear() {
    const tbody = document.querySelector('table#soundtable tbody');
    tbody.innerHTML = '';
    _updateDocumentLocation();
  }

  // TODO needs validation
  function importData(input) {
    if (input) {
      clear();
      const tokens = JSON.parse(input);
      for (let i = 0 ; i < tokens.length - 1; i += 2) {
        addRow(tokens[i], tokens[i + 1]);
      }
    }
  }
  
  function _updateDocumentLocation() {
    let href = document.location.href.split('?')[0];
    let queryParts = {};
    
    const freqsAndLengths = _getFreqsAndLengths();
    if (freqsAndLengths.length) {
      queryParts['freqs'] = JSON.stringify(freqsAndLengths);
    }
    if (Object.entries(queryParts).length > 0) {
      const query = Object.entries(queryParts).map(([k, v]) => `${k}=${v}`).reduce((a, b) => `${a}&${b}`);
      href = `${href}?${query}`;
    } 
      
    window.history.replaceState(
      window.history.state,
      document.title,
      href
    );
  }

  /**
   * @param {KeyboardEvent} e
   */
  function _suppressEnter(e) {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  }
  
  function _onChange(e) {
    e.target.innerHTML = e.target.innerHTML.replace('/[^0-9]/g', '');
    _updateDocumentLocation();
  }
  
  jwb.soundtool = { addRow, init, clear, play, importData };
}
