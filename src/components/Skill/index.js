import React from 'react'
import './index.scss'
const debug = require('debug')('app')
import { js_beautify as beautify } from 'js-beautify'
import * as requests from './requests.json'

class Skill extends React.Component {
  constructor(props) {
    super(props);

    this.doRequest = this.doRequest.bind(this);
    this.createRequest = this.createRequest.bind(this);
    this.setRequest = this.setRequest.bind(this);

    this.state = {
      request: this.createRequest(props),
      validRequest: true
    }
  }

  createRequest(props) {
    debug('Skill Component: createRequest')

    const request = Object.assign({}, requests[props.requestType])

    if ('intent' === props.requestType) {
      request.request.intent.name = ''
      request.request.intent.slots = {}

      if (props.intentName) {
        request.request.intent.name = props.intentName
      }

      if (props.slots.size >= 1) {
        props.slots.forEach(function(slot) {
          request.request.intent.slots[slot.key] = {
            name: slot.key,
            value: slot.value
          }
        })
      }
    }

    return beautify(JSON.stringify(request))
  }

  setRequest(jsonString) {
    let validRequest;
    try {
      let json = JSON.parse(jsonString)
      validRequest = true
    } catch (error) {
      validRequest = false
    }

    this.setState({
      request: jsonString,
      validRequest: validRequest
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      request: this.createRequest(nextProps)
    })
  }

  doRequest() {
    debug('Skill Component: doRequest');
    if (this.state.validRequest) {
      this.props.actions.doRequest(JSON.parse(this.state.request));
    }
  }

  render() {
    debug('Skill Component: render');

    const request = this.state.request
    const response = beautify(JSON.stringify(this.props.response))
    const requestClass = (this.state.validRequest) ? 'code' : 'invalid code'

    let chosenModelIntent = null

    if (this.props.intentName && window.INTERACTION_MODEL && window.INTERACTION_MODEL.interactionModel && window.INTERACTION_MODEL.interactionModel.languageModel && window.INTERACTION_MODEL.interactionModel.languageModel.intents) {
      for (let i = 0; i < window.INTERACTION_MODEL.interactionModel.languageModel.intents.length; i++) {
        if (this.props.intentName === window.INTERACTION_MODEL.interactionModel.languageModel.intents[i].name && window.INTERACTION_MODEL.interactionModel.languageModel.intents[i].slots && window.INTERACTION_MODEL.interactionModel.languageModel.intents[i].slots.length > 0) {
          chosenModelIntent = window.INTERACTION_MODEL.interactionModel.languageModel.intents[i]
          break;
        }
      }
    }

    console.log(this.props);

    return (
      <div className="container-fluid">
        <div className="page-header">
          <h1>Alexa Skill Test <small>{window.SKILL_NAME}</small></h1>
        </div>

        <p>Alexa Skill Test lets you easily mock requests to send to your Alexa skill locally. This page will automatically refresh when you update your skill.</p>

        <div className="form-group">
          <label htmlFor="requestType">Request Type:</label>
          <select id="requestType" className="form-control" defaultValue={this.props.requestType} onChange={(event) => this.props.actions.setRequestType(event.target.value)} id="request_type">
            <option value="launch">LaunchRequest</option>
            <option value="intent">IntentRequest</option>
            <option value="session_end">SessionEndedRequest</option>
          </select>
        </div>

        {'intent' === this.props.requestType ?
          <div>
            <div className="form-group">
              <label htmlFor="intent">Intent Name:</label>
              {window.INTERACTION_MODEL && window.INTERACTION_MODEL.interactionModel && window.INTERACTION_MODEL.interactionModel.languageModel && window.INTERACTION_MODEL.interactionModel.languageModel.intents ?
                <select defaultValue={this.props.intentName} className="form-control" id="intent" onChange={(event) => this.props.actions.setIntentName(event.target.value)}>
                  {window.INTERACTION_MODEL.interactionModel.languageModel.intents.map(function(intent) {
                    return <option key={intent.name} value={intent.name}>{intent.name}</option>
                  }, this)}
                </select>
              :
                <input className="form-control" type="text" id="intent" onChange={(event) => this.props.actions.setIntentName(event.target.value)} />
              }
            </div>

            <div className="form-group">
              <label>Slots:</label>

              {chosenModelIntent ?
                <div>
                  {chosenModelIntent.slots && chosenModelIntent.slots.map(function(slot) {
                    return <div className="slot" key={slot.name}>
                      <input className="form-control" placeholder="Name" onChange={(event) => this.props.actions.setSlotKey(event.target.value, slot.name)} value={slot.name} type="text" />
                      <input className="form-control" placeholder="Value" onChange={(event) => this.props.actions.setSlotValue(event.target.value, slot.name)} value={slot.value} type="text" />
                    </div>
                  }, this)}
                </div>
              :
                <div>
                  {this.props.slots && this.props.slots.map(function(slot, index) {
                    return <div className="slot" key={slot.id}>
                      <input className="form-control" placeholder="Name" onChange={(event) => this.props.actions.setSlotKey(event.target.value, slot.id)} value={slot.key} type="text" />
                      <input className="form-control" placeholder="Value" onChange={(event) => this.props.actions.setSlotValue(event.target.value, slot.id)} value={slot.value} type="text" />

                      <a href="javascript:void(0)" className="delete-slot" onClick={(event) => this.props.actions.deleteSlot(slot.id)}>&times;</a>
                    </div>
                  }, this)}
                  <div className="form-group">
                    <a href="javascript:void(0)" onClick={() => this.props.actions.createSlot()}>Add a slot</a>
                  </div>
                </div>
              }
            </div>
          </div>
          :
          ''
        }
        <div>
          <input type="button" className="btn btn-primary btn-lg" value="Send Request" onClick={this.doRequest} />
        </div>

        <div className="row req-resp">
          <div className="col-md-6">
            <h2>Request</h2>
            <textarea className={requestClass} onChange={(event) => this.setRequest(event.target.value)} value={request}></textarea>
          </div>
          <div className="col-md-6">
            <h2>Response</h2>
            <div className="response" className="code">{response}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Skill
