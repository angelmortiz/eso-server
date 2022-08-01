exports.getHome = (request, response, next) => {
    response.render('./home', {
        pageTitle: 'Welcome to En Salud Optima application!'
      });
};