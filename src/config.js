module.exports = {
  package: './package.json',
  extensions: ['.js', '.html', '.css'],
  headers: {
      js: (comment) => `/*! ${comment} */`,
      html: (comment) => `<!-- ${comment} -->`,
      css: (comment) => `/** ${comment} **/`,
  }
};