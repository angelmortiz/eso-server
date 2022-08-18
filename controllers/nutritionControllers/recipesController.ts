import Recipe from '../../models/nutritionModels/recipeModel';

export const getRecipe = (request, response, next) => {
  response.render('./nutrition/view-recipe', {
    caller: 'view-recipe',
    pageTitle: 'Información de receta',
  });
};

export const getAddRecipe = (request, response, next) => {
  response.render('./nutrition/add-recipe', {
    caller: 'add-recipe',
    pageTitle: 'Añadir receta',
  });
};

export const addRecipe = (request) => {
  const recipe = new Recipe(request.body);
  recipe.save();
  console.log(Recipe.fetchAll());
  // response.redirect('/nutrition/recipe')
};