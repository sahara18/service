module.exports = [
  {
    file: __dirname + '/../node_modules/react/dist/react.js',
    url: '/client/vendors/js/react/react.min.js',
    packageName: 'react',
    alias: 'React'
  },
  {
    file: __dirname + '/../node_modules/react-dom/dist/react-dom.min.js',
    url: '/client/vendors/js/react/react-dom.min.js',
    packageName: 'react-dom',
    alias: 'ReactDOM'
  },
  {
    file: __dirname + '/../node_modules/react-router/umd/ReactRouter.min.js',
    url: '/client/vendors/js/react/react-router.min.js',
    packageName: 'react-router',
    alias: 'ReactRouter'
  },
  {
    file: __dirname + '/../node_modules/lodash/lodash.min.js',
    url: '/client/vendors/js/lodash/lodash.min.js',
    packageName: 'lodash',
    alias: '_'
  }
];
