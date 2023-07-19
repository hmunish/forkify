import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

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
    alert(err);
  }
};

// Adding event listener to load recipes according to hash
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
