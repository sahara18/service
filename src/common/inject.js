import _ from 'lodash';
import {connect} from 'react-redux';

export default modules => connect(state => _.pick(state, modules), dispatch => ({dispatch}));
