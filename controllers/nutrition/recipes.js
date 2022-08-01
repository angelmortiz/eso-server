const recipes = [];

exports.getRecipe = (request, response, next) => {
  response.render('./nutrition/view-recipe', {
    caller: 'view-recipe',
    recipes: recipes,
    pageTitle: 'Información de receta',
  });
};

exports.getAddRecipe = (request, response, next) => {
  response.render('./nutrition/add-recipe', {
    caller: 'add-recipe',
    recipes: recipes,
    pageTitle: 'Añadir receta',
  });
};
