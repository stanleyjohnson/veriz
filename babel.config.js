module.exports = function (api) {
    api.cache(true);
    const plugins = [['@babel/plugin-transform-react-jsx',{ "pragma": "h" }]];
    return {
      plugins
    };
  }
  