import React from 'react';
import axios from 'axios';
import {Link} from 'react-router';
import inject from '@common/inject';

@inject(['test'])
export default class About extends React.Component {
  async componentDidMount() {
    let {data} = await axios.get('/api/test');
    console.log(data);
  }

  decrease() {
    this.props.dispatch({type: 'DECREMENT'});
  }

  render() {
    return (
      <div className="about">
        <h4>About</h4>
        <div>{this.props.test.counter}</div>
        <div><button onClick={::this.decrease}>decrease</button></div>
        <Link to="/">Home</Link>
      </div>
    );
  }
}
