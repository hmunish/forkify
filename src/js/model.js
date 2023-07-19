import { async } from 'regenerator-runtime';

export const state = {
  recipe: {},
};

export const loadRecipe = async id => {
  // Fetching recipe data from the API
  const res = await fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
  );
  const data = await res.json();

  // Throwing error if res.ok is false
  if (!res.ok) throw new Error(`${data.message} (${res.status})`);

  let { recipe } = data.data;
  // Converting recipe object to with required naming conventions
  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
  };
};
