import { SET_REQUEST_TYPE, ADD_SLOT, SET_INTENT_NAME, SET_SLOT_KEY, DELETE_SLOT, SET_FIXED_SLOT, SET_SLOT_VALUE, SET_REQUEST, DO_REQUEST, CREATE_SLOT } from '../constants/ActionTypes'
import immutable from 'immutable'
const debug = require('debug')('app')

const initialState = immutable.Map({
  slots: immutable.List(),
  requestType: 'launch',
  intentName: '',
  response: {}
});

export default function(state = initialState, action) {
  debug('Reduce: ' + action.type)

  switch (action.type) {
    case SET_REQUEST_TYPE:
      return state.set('requestType', action.requestType)
    case ADD_SLOT:
      return state
    case SET_INTENT_NAME:
      return state.set('intentName', action.intentName)
    case SET_FIXED_SLOT:
      var slots = state.get('slots')

      var updated = false

      slots = slots.map(function(slot) {
        if (slot.name === action.name) {
          slot.value = action.value
          updated = true
        }

        return slot
      })

      if (!updated) {
        let newSlot = {
          name: action.name,
          value: action.value
        }

        return state.set('slots', state.get('slots').push(newSlot))
      }

      return state.set('slots', slots)
    case CREATE_SLOT:
      return state.set('slots', state.get('slots').push(action.slot))
    case SET_SLOT_KEY:
      var slots = state.get('slots')

      slots = slots.map(function(slot) {
        if (slot.id === action.id) {
          slot.key = action.key
        }

        return slot
      })

      return state.set('slots', slots)
    case DELETE_SLOT:
      var slots = state.get('slots')

      slots = slots.filter(function(slot) {
        if (slot.id === action.id) {
          return false
        }

        return true
      })

      console.log(slots);

      return state.set('slots', slots)
    case SET_SLOT_VALUE:
      var slots = state.get('slots')

      slots = slots.map(function(slot) {
        if (slot.id === action.id) {
          slot.value = action.value
        }

        return slot
      })

      return state.set('slots', slots)
    case DO_REQUEST:
      return state.set('response', action.response)
    default:
      return state
  }
};
