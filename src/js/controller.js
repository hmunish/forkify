import { async } from 'regenerator-runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

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
    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Render seacrh results
    await model.loadSearchResults(query);

    console.log(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchRecipes);
};

init();
