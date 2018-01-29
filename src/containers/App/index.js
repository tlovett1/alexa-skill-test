import Skill from '../../components/Skill';
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as Actions from '../../actions'
import PropTypes from 'prop-types'
import './index.scss'

class App extends React.Component {
  render() {
    return (
      <div>
        <Skill {...this.props} />
      </div>
    )
  }
}

App.propTypes = {
  slots: PropTypes.object.isRequired,
  intentName: PropTypes.string.isRequired,
  requestType: PropTypes.string.isRequired,
  response: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  requestType: state.get('requestType'),
  intentName: state.get('intentName'),
  response: state.get('response'),
  slots: state.get('slots')
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
