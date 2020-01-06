class SoundTool {
  /**
   * @type SoundTable[]
   */
  tables;

  constructor() {
    this.tables = [];
    const query = document.location.href.split('?')[1];
    if (query) {
      const match = query.match(/freqs=([0-9,\[\]]+)/);
      if (match) {
        const data = this._parseData(match[1]);
        // multiple tables
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          for (let i = 0; i < data.length; i++) {
            this.tables.push(new SoundTable(data[i], data[i].length, () => this._updateDocumentLocation(), () => this.render()));
          }
        } else {
          this.tables.push(new SoundTable(data, data.length, () => this._updateDocumentLocation(), () => this.render()));
        }
      }
    } else {
      this.tables.push(new SoundTable([], 5, () => this._updateDocumentLocation(), () => this.render()));
    }

    this.render();
    this._updateDocumentLocation();
  }

  play() {
    this.tables.forEach(table => table.play());
  }

  stop() {
    this.tables.forEach(table => table.stop());
  }

  render() {
    const container = document.querySelector('.tableContainer');
    container.innerHTML = '';
    this.tables.forEach(table => container.appendChild(table.render()));
  }

  addTable() {
    this.tables.push(new SoundTable([], 5, () => this._updateDocumentLocation(), () => this.render()));
    this.render();
  }

  clear() {
    this.tables = [new SoundTable([], 5, () => this._updateDocumentLocation(), () => this.render())];
    this.render();
    this._updateDocumentLocation();
  }

  _updateDocumentLocation() {
    let data;
    if (this.tables.length > 1) {
      data = this.tables.map(table => table.data);
    } else {
      data = this.tables[0].data;
    }

    let href = document.location.href.split('?')[0];
    let queryParts = {};

    if (data.length) {
      queryParts['freqs'] = JSON.stringify(data);
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

  _parseData(match) {
    const data = JSON.parse(match);
    // multiple tables
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data.filter(table => !!table[0]);
    }
    return data;
  }
}
