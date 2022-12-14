import { async } from 'regenerator-runtime';
import { API_URL, RESULT_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers';
/////////////////////////////////////

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: `${RESULT_PER_PAGE}`,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

// this function will responsible for fetching our data from our forkify API
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    const { recipe } = data.data;
    state.recipe = createRecipeObject(data);

    state.bookmarks.some(bookmark => bookmark.id === id)
      ? (state.recipe.bookmarked = true)
      : (state.recipe.bookmarked = false);

    console.log(recipe);
  } catch (err) {
    throw err;
  }
};

// this function is responsible to load search result
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
// NOTE about error
// in the "helper file" we describe why we throw error, we throw it so in case that an error happen in "getSON" it rejected and the promise return it from be reject promise and be able to catch it here.
// now we need to render the error that happen here in this function in case some error happen but we need to controle it in the "controller" file, so like before we should throw a new error to make this promise as rejected in case of an error happen and then it will return a rejected promise so we can then handel it in "controller" file.

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.result.slice(start, end);

  // (start and end) are starting and ending point, so if we request page 1: (1-1) = 0 * 10 = 0 so it start with 0 and end with 1 * 10 and if we request page 2: (2-1) = 1 * 10 = 10 so it start by item 10 and finish with 2 * 10 = 20 and so one
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add Bookmark
  state.bookmarks.push(recipe);

  // mark current recipes as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deletBookmark = function (id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipes as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks()

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
