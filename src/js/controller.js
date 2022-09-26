import * as model from './model.js';
import icons from 'url:../img/icons.svg';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
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

    // 0) update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 2) loading recipe
    await model.loadRecipe(id);
    // 3) rendering recipes
    recipeView.render(model.state.recipe);
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
  // 1) ADD/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deletBookmark(model.state.recipe.id);

  // 2 Update recipe view
  recipeView.update(model.state.recipe);

  // 3 Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new Recipe data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, 2500);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHnadlerRender(controlRecipes);
  recipeView.addHandlerUpadateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBokkmark);

  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
