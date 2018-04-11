import { SET_REQUEST_TYPE, SET_INTENT_NAME, SET_SLOT_NAME, DELETE_SLOT, SET_FIXED_SLOT, SET_SLOT_VALUE, SET_REQUEST, DO_REQUEST, CREATE_SLOT } from '../constants/ActionTypes'
import immutable from 'immutable'
const debug = require('debug')('app')

const initialState = immutable.Map({
  slotsByIntent: immutable.Map(),
  requestType: 'launch',
  intentName: '',
  response: {}
});

export default function(state = initialState, action) {
  debug('Reduce: ' + action.type)

  switch (action.type) {
    case SET_REQUEST_TYPE:
      if (action.firstIntentName) {
        state = state.set('intentName', action.firstIntentName)
      }

      return state.set('requestType', action.requestType)
    case SET_INTENT_NAME:
      return state.set('intentName', action.intentName)
    case SET_FIXED_SLOT:
      var slotsByIntent = state.get('slotsByIntent')
      var intentSlots = slotsByIntent.get(action.intentName)
      var updated = false

      if (!intentSlots) {
        intentSlots = immutable.List()

        intentSlots = intentSlots.push({
          name: action.name,
          id: action.name,
          value: action.value
        })

        return state.set('slotsByIntent', slotsByIntent.set(action.intentName, intentSlots))
      }

      intentSlots = intentSlots.map((slot) => {
        if (slot.name === action.name) {
          slot.value = action.value
          updated = true
        }

        return slot
      })

      if (!updated) {
        intentSlots = intentSlots.push({
          name: action.name,
          id: action.name,
          value: action.value
        })
      }

      return state.set('slotsByIntent', slotsByIntent.set(action.intentName, intentSlots))
    case CREATE_SLOT:
      var slotsByIntent = state.get('slotsByIntent')
      var intentSlots = slotsByIntent.get(action.intentName)

      if (!intentSlots) {
        intentSlots = immutable.List()
      }

      intentSlots = intentSlots.push({
        id: action.id,
        name: action.name,
        value: action.value
      })

      return state.set('slotsByIntent', slotsByIntent.set(action.intentName, intentSlots))
    case SET_SLOT_NAME:
      var slotsByIntent = state.get('slotsByIntent')
      var intentSlots = slotsByIntent.get(action.intentName)

      if (!intentSlots) {
        return state
      }

      intentSlots = intentSlots.map((slot) => {
        if (slot.id === action.id) {
          slot.name = action.name
        }

        return slot
      })

      return state.set('slotsByIntent', slotsByIntent.set(action.intentName, intentSlots))
    case DELETE_SLOT:
      var slotsByIntent = state.get('slotsByIntent')
      var intentSlots = slotsByIntent.get(action.intentName)

      if (!intentSlots) {
        return state
      }

      intentSlots = intentSlots.filter((slot) => {
        if (slot.id === action.id) {
          return false
        }

        return true
      })

      return state.set('slotsByIntent', slotsByIntent.set(action.intentName, intentSlots))
    case SET_SLOT_VALUE:
      var slotsByIntent = state.get('slotsByIntent')
      var intentSlots = slotsByIntent.get(action.intentName)

      if (!intentSlots) {
        return state
      }

      intentSlots = intentSlots.map((slot) => {
        if (slot.id === action.id) {
          slot.value = action.value
        }

        return slot
      })

      return state.set('slotsByIntent', slotsByIntent.set(action.intentName, intentSlots))
    case DO_REQUEST:
      return state.set('response', action.response)
    default:
      return state
  }
};
