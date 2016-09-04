import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom/server';
import {Provider} from 'react-redux';
import {match, RouterContext} from 'react-router';

import store from '@common/store';
import routes from './routes';

export default (req, res) => {
  match({routes, location: req.url}, (err, redirectLocation, renderProps) => {
    if (err) {
      res.status(500).send(err.message);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (renderProps) {
      let html = '<!DOCTYPE html>' + ReactDOM.renderToString(
        <Provider store={store}>
          <RouterContext {...renderProps}/>
        </Provider>
      );
      res.status(200).send(html);
    } else {
      res.status(404).send('Not found');
    }
  });
};
