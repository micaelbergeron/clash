import _ from 'lodash';
import * as actions from 'actions/actions.js';
import { connect } from 'react-redux';
import App from './App';


const mapStateToProps = (state) => ({
  multiplexFactor: state.multiplex,
})

export default connect(mapStateToProps)(App);
