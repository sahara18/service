import React from 'react';
import {Link} from 'react-router';
import inject from '@common/inject';

@inject(['test'])
export default class Home extends React.Component {
  increase() {
    this.props.dispatch({type: 'INCREMENT'});
  }

  render() {
    return (
      <div className="home">
        <h4>Home</h4>
        <div>{this.props.test.counter}</div>
        <div><button onClick={::this.increase}>increase</button></div>
        <Link to="/about">About</Link>
      </div>
    );
  }
}
