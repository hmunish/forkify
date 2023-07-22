import { async } from 'regenerator-runtime';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

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

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
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
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Delete bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmarks view
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loading spinner on Recipe view
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // Render uploaded recipe to view
    recipeView.render(model.state.recipe);

    // Render success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change hash id in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close add recipe form overlay
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHanlerClick(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipes);
  paginationView.addHanlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
