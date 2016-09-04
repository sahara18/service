import React from 'react';
import vendors from '@config/vendors';

export default class App extends React.Component {
  render() {
    return (
      <html>
        <head>
          <link rel="stylesheet" href="/client/static/css/style.css"/>
          {vendors.map(({url}, key) => (<script src={url} key={key}/>))}
        </head>
        <body>
          <div className="app">
            {this.props.children}
          </div>
          <script src="/client/static/js/lib.js"/>
          <script src="/client/static/js/app.js"/>
        </body>
      </html>
    );
  }
}
