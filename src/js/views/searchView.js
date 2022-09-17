class SearchView {
  _parentEl = document.querySelector('.search');

  getQuerry() {
    const querry = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return querry;
  }

  addHandlerSearch(render) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      render();
    });
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
