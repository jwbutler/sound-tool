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
  onUpdate;

  /**
   * @param {int[][] | null} data
   * @param {int} numRows
   * @param {Function<void, void>} onUpdate
   */
  constructor(data, numRows, onUpdate) {
    this.tableElement = document.querySelector('table'); // TODO
    this.soundPlayer = new SoundPlayer();
    this.data = data;
    this.numRows = numRows;
    this.onUpdate = onUpdate;

    this._renderTable();
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

  _renderTable() {
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
  }

  play() {
    this.soundPlayer.playMulti(this.data);
  }

  addRow() {
    this.numRows++;
    this._renderTable();
  }

  removeRow(rowElement) {
    this.tableElement.removeChild(rowElement);
    this.onUpdate();
  }

  clear() {
    this.data = [];
    this._renderTable();
    this.onUpdate();
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
    this.onUpdate();
  }

  _readTableData() {
    const tbody = this.tableElement.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const data = [];
    for (let i = 0; i < this.numRows; i++) {
      const row = rows[i];
      const freq = parseInt(row.querySelector('.freq').value);
      const ms = parseInt(row.querySelector('.ms').value);
      if ((!!freq || freq === 0) && (!!ms || ms === 0)) {
        data.push([freq, ms]);
      }
    }
    return data;
  }
}
