window.jwb = window.jwb || {};

class SoundTable {
  /**
   * @type {Element}
   */
  tableElement;
  /**
   * @type {int[][]} data
   */
  data;
  /**
   * @type {int}
   */
  numRows;
  /**
   * @type {Function<void, void>}
   */
  updateLocation;
  /**
   * @type {Function<void, void>}
   */
  renderParent;

  /**
   * @param {int[][] | null} data
   * @param {int} numRows
   * @param {Function<void, void>} updateLocation
   * @param {Function<void, void>} renderParent
   */
  constructor(data, numRows, updateLocation, renderParent) {
    this.tableElement = this._createTable();
    this.soundPlayer = new SoundPlayer();
    this.data = data;
    this.numRows = numRows;
    this.updateLocation = updateLocation;
    this.renderParent = renderParent;
  }

  /**
   * <table>
   *   <thead>
   *      <tr>
   *        <th>Frequency (Hz)</th>
   *        <th>Duration (ms)</th>
   *        <th></th>
   *      </tr>
   *    </thead>
   *    <tbody>
   *    </tbody>
   *  </table>
   *
   * @return {Element}
   */
  _createTable() {
     const table = document.createElement('table');
     const thead = document.createElement('thead');
     const tr1 = document.createElement('tr');
     const th1 = document.createElement('th');
     const th2 = document.createElement('th');
     const th3 = document.createElement('th');
     const tbody = document.createElement('tbody');
     const tfoot = document.createElement('tfoot');
     const tr2 = document.createElement('tr');
     const td = document.createElement('td');
     const button = document.createElement('button');
     th1.innerHTML = 'Frequency (Hz)';
     th2.innerHTML = 'Duration (ms)';
     td.colSpan = 2;
     button.innerHTML = 'Add row';
     button.onclick = () => this.addRow('', '');
     table.appendChild(thead);
     thead.appendChild(tr1);
     tr1.appendChild(th1);
     tr1.appendChild(th2);
     tr1.appendChild(th3);
     table.appendChild(tbody);
     table.appendChild(tfoot);
     tfoot.appendChild(tr2);
     tr2.appendChild(td);
     td.appendChild(button);

     return table;
  }

  _renderRow(freq, ms) {
    const tr = document.createElement('tr');

    {
      const td = document.createElement('td');
      tr.appendChild(td);
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'freq';
      input.onchange = (e) => this._onChange(e);
      input.onkeydown = this._suppressEnter;
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
      input.onchange = (e) => this._onChange(e);
      input.onkeydown = this._suppressEnter;
      input.value = ms;
      input.contentEditable = 'true';
      td.appendChild(input);
    }
    {
      const td = document.createElement('td');
      tr.appendChild(td);
      const button = document.createElement('button');
      button.innerHTML = 'Delete';
      button.onclick = () => this.removeRow(tr);
      button.tabIndex = -1;
      td.appendChild(button);
    }

    return tr;
  }

  render() {
    const tbody = this.tableElement.querySelector('tbody');
    tbody.innerHTML = '';
    for (let i = 0; i < this.numRows; i++) {
      let row;
      if (i < this.data.length) {
        const [freq, ms] = this.data[i];
        row = this._renderRow(freq, ms);
      } else {
        row = this._renderRow('', ''); // empty row
      }
      tbody.appendChild(row);
    }

    return this.tableElement;
  }

  play() {
    this.soundPlayer.playMulti(this.data);
  }

  stop() {
    this.soundPlayer.stop();
  }

  addRow() {
    this.numRows++;
    this.updateLocation();
    this.renderParent();
  }

  removeRow(rowElement) {
    const i = [...this.tableElement.querySelectorAll('tbody tr')].indexOf(rowElement);
    this.data.splice(i, 1);
    this.numRows--;
    this.updateLocation();
    this.renderParent();
  }

  setData(data) {
    this.data = data;
    this.updateLocation();
    this.renderParent();
  }

  clear() {
    this.setData([]);
  }

  /**
   * @param {KeyboardEvent} e
   */
  _suppressEnter(e) {
    if (e.code === 'Enter') {
      e.preventDefault();
    }
  }
  
  _onChange(e) {
    e.target.innerHTML = e.target.innerHTML.replace('/[^0-9]/g', '');
    this.data = this._readTableData();
    this.updateLocation();
  }

  _readTableData() {
    const tbody = this.tableElement.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const data = [];
    for (let i = 0; i < this.numRows; i++) {
      const row = rows[i];
      let freq = parseInt(row.querySelector('.freq').value);
      let ms = parseInt(row.querySelector('.ms').value);
      if (freq || ms) {
        data.push([freq || 0, ms || 0]);
      }
    }
    return data;
  }
}
