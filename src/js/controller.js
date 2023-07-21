import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';

if (module.hot) {
  module.hot.accept();
}

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    // Taking hash from the url
    const id = window.location.hash.slice(1);

    // Returning if no id exist
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Fetching data from the api
    await model.loadRecipe(id);

    // Rendering recipe on the view
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

export const controlSearchRecipes = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Render seacrh results
    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (pageNum) {
  resultsView.render(model.getSearchResultsPage(pageNum));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Check if new servings is greater than 0
  if (newServings < 1) return;
  // Update the servings in model
  model.updateSevings(newServings);
  // Update the DOM
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHanlerClick(controlServings);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHanlerClick(controlPagination);
};

init();
