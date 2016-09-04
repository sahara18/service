import React from 'react';
import {Route} from 'react-router';

import App from '@components/app';
import Home from '@components/home';
import About from '@components/about';

export default (
  <Route component={App}>
    <Route path="/" component={Home}/>
    <Route path="/about" component={About}/>
  </Route>
);
