import * as model from './model.js';
import recipeView from './views/recipeView.js';
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
    alert(err);
  }
};

// Adding event listener to load recipes according to hash
['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipes)
);
