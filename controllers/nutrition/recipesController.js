const Recipe = require('../../models/nutrition/recipe');

exports.getRecipe = (request, response, next) => {
  response.render('./nutrition/view-recipe', {
    caller: 'view-recipe',
    pageTitle: 'Información de receta',
  });
};

exports.getAddRecipe = (request, response, next) => {
  response.render('./nutrition/add-recipe', {
    caller: 'add-recipe',
    pageTitle: 'Añadir receta',
  });
};

exports.addRecipe = (request) => {
  const recipe = new Recipe(request.body);
  recipe.save();
  console.log(Recipe.fetchAll());
  // response.redirect('/nutrition/recipe')
};