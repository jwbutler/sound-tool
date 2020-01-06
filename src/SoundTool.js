class SoundTool {
  /**
   * @type SoundTable[]
   */
  tables;

  constructor() {
    this.tables = [new SoundTable([], 10, () => this.updateDocumentLocation())];
  }

  readQuery() {
    const query = document.location.href.split('?')[1];
    if (query) {
      const match = query.match(/freqs=([0-9,\[\]]+)/);
      if (match) {
        this.tables[0].data = JSON.parse(match[1]);
      }
    }
  }

  play() {
    this.tables.forEach(table => table.play());
  }

  updateDocumentLocation() {
    const data = this.tables[0].data;
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
}
