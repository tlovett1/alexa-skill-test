import * as types from '../constants/ActionTypes'
import _ from 'lodash'
import $ from 'jquery'
const debug = require('debug')('app')
import shortid from 'shortid'

export const setRequestType = function(type) {
  debug('Action: setRequestType')
  return {
    type: types.SET_REQUEST_TYPE,
    requestType: type
  }
}

export const setIntentName = function(name) {
  debug('Action: setIntentName')
  return {
    type: types.SET_INTENT_NAME,
    intentName: name
  }
}

export const setSlotName = function(name, id, intentName) {
  debug('Action: setSlotName')
  return {
    type: types.SET_SLOT_NAME,
    intentName: intentName,
    id: id,
    name: name
  }
}

export const setSlotValue = function(value, id, intentName) {
  debug('Action: setSlotValue')
  return {
    type: types.SET_SLOT_VALUE,
    intentName: intentName,
    id: id,
    value: value
  }
}

export const setFixedSlot = function(value, name, intentName) {
  debug('Action: setFixedSlot')
  return {
    type: types.SET_FIXED_SLOT,
    intentName: intentName,
    name: name,
    value: value,
    id: name
  }
}

export const createSlot = function(intentName) {
  debug('Action: createSlot')
  return {
    type: types.CREATE_SLOT,
    intentName: intentName,
    name: '',
    value: '',
    id: shortid.generate()
  }
}

export const deleteSlot = function(id, intentName) {
  debug('Action: deleteSlot')
  return {
    type: types.DELETE_SLOT,
    intentName: intentName,
    id: id
  }
}

export const doRequest = function(request) {
  debug('Action: doRequest')
  return function(dispatch) {
    $.ajax({
      method: 'post',
      url: '/lambda',
      data: {
        event: request
      }
    }).done(function(data) {
      debug('Action: doRequest done')
      dispatch({
        type: types.DO_REQUEST,
        response: data
      });
    }).fail(function(error, response) {
      debug('Action: doRequest error')
      dispatch({
        type: types.DO_REQUEST,
        response: 'An error occurred'
      });
    });
  }
}
