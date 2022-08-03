exports.getHome = (request, response, next) => {
    response.render('./home', {
        caller: 'home',
        pageTitle: 'Welcome to En Salud Optima application!'
      });
};