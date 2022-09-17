import * as model from './model.js';
import icons from 'url:../img/icons.svg';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
//
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////
// application

const controlRecipes = async function () {
  try {
    // get the ID from the HASH
    const id = window.location.hash.slice(1);
    if (!id) return;
    // rendering spinner
    recipeView.renderSpinner();

    //0 ) update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    // 1) loading recipe
    await model.loadRecipe(id);
    // 2) rendering recipes
    recipeView.render(model.state.recipe);

    // test
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // render spiner
    resultView.renderSpinner();
    // 1) get search querry
    const query = searchView.getQuerry();
    if (!query) return;

    // 2) load search
    await model.loadSearchResults(query);

    // 3) Render search
    // get all result in one page
    // resultView.render(model.state.search.result);
    // get result as we requet
    resultView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    // resultView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) render new results
  resultView.render(model.getSearchResultsPage(goToPage));

  // 2) Render new pagination btns
  paginationView.render(model.state.search);
};

//
const controlServings = function (newServings) {
  // update the recipe servings (in the state)
  model.updateServings(newServings);
  // update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBokkmark = function () {
  // 1)
  // if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  // else model.dele
};

const init = function () {
  recipeView.addHnadlerRender(controlRecipes);
  recipeView.addHandlerUpadateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBokkmark);

  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
};
init();
