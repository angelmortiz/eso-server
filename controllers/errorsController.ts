export const get404 = (request, response, next) => {
    response.render('./404', {
        pageTitle: 'Page not found'
      });
};