import View from './view.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try another one ';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();

// is to display the UI for search result we import all the properties and method from the Parent class view, and all the properties and method that are here are unique to this part
