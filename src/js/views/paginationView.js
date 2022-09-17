import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.getAttribute('data-goTo');
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    // we need to know how many page the result to be able to dispaly the pagination
    const numPage = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    // simulating all the senarios that will happen

    // Page 1, and there are other pages
    if (curPage === 1 && numPage > 1) {
      return `
      <button data-goTo ="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
      `;
    }

    // last page
    if (curPage === numPage && numPage > 1) {
      return `
      <button data-goTo ="${
        curPage - 1
      }"  class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
    </button>
      `;
    }

    // other page
    if (curPage < numPage) {
      return `
      <button data-goTo ="${
        curPage - 1
      }"  class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>${curPage - 1}</span>
      </button>
      <button data-goTo ="${
        curPage + 1
      }"  class="btn--inline pagination__btn--next">
      <span>${curPage + 1}</span>
      <svg class="search__icon">
      <use href="${icons}#icon-arrow-right"></use>
      </svg>
      </button>
      `;
    }

    // page 1, and there are NO pages
    return ``;
  }
}

export default new PaginationView();
