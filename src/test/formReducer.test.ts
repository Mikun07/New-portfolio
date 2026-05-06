// @vitest-environment node
import { describe, it, expect } from 'vitest'

// Mirror the types and reducer from Contact.tsx so we can test the logic in isolation
interface FormState {
  name: string
  email: string
  subject: string
  message: string
  sending: boolean
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<FormState, 'sending'>; value: string }
  | { type: 'SET_SENDING'; value: boolean }
  | { type: 'RESET' }

const initialState: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  sending: false,
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_SENDING':
      return { ...state, sending: action.value }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

describe('formReducer', () => {
  it('returns initial state unchanged for unknown action', () => {
    // @ts-expect-error — intentionally passing an unknown action to test default branch
    const result = formReducer(initialState, { type: 'UNKNOWN' })
    expect(result).toEqual(initialState)
  })

  it('SET_FIELD updates the correct field without mutating others', () => {
    const state: FormState = { ...initialState, name: 'Alice' }
    const result = formReducer(state, { type: 'SET_FIELD', field: 'email', value: 'alice@example.com' })
    expect(result.email).toBe('alice@example.com')
    expect(result.name).toBe('Alice')
    expect(result.subject).toBe('')
    expect(result.message).toBe('')
    expect(result.sending).toBe(false)
  })

  it('SET_FIELD can update every text field', () => {
    const fields: Array<keyof Omit<FormState, 'sending'>> = ['name', 'email', 'subject', 'message']
    fields.forEach((field) => {
      const result = formReducer(initialState, { type: 'SET_FIELD', field, value: 'test value' })
      expect(result[field]).toBe('test value')
    })
  })

  it('SET_SENDING sets sending to true', () => {
    const result = formReducer(initialState, { type: 'SET_SENDING', value: true })
    expect(result.sending).toBe(true)
  })

  it('SET_SENDING sets sending back to false', () => {
    const state: FormState = { ...initialState, sending: true }
    const result = formReducer(state, { type: 'SET_SENDING', value: false })
    expect(result.sending).toBe(false)
  })

  it('RESET returns exactly the initial state', () => {
    const dirty: FormState = {
      name: 'Bob',
      email: 'bob@example.com',
      subject: 'Hello',
      message: 'World',
      sending: true,
    }
    const result = formReducer(dirty, { type: 'RESET' })
    expect(result).toEqual(initialState)
  })
})
