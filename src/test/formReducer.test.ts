// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { formReducer, initialFormState, type FormAction, type FormField, type FormState } from '../features/contact/formReducer'

describe('formReducer', () => {
  it('returns initial state unchanged for unknown action', () => {
    const result = formReducer(initialFormState, { type: 'UNKNOWN' } as unknown as FormAction)
    expect(result).toEqual(initialFormState)
  })

  it('SET_FIELD updates the correct field without mutating others', () => {
    const state: FormState = { ...initialFormState, name: 'Alice' }
    const result = formReducer(state, { type: 'SET_FIELD', field: 'email', value: 'alice@example.com' })
    expect(result.email).toBe('alice@example.com')
    expect(result.name).toBe('Alice')
    expect(result.subject).toBe('')
    expect(result.message).toBe('')
    expect(result.sending).toBe(false)
  })

  it('SET_FIELD can update every text field', () => {
    const fields: FormField[] = ['name', 'email', 'subject', 'message']
    fields.forEach((field) => {
      const result = formReducer(initialFormState, { type: 'SET_FIELD', field, value: 'test value' })
      expect(result[field]).toBe('test value')
    })
  })

  it('SET_SENDING sets sending to true', () => {
    const result = formReducer(initialFormState, { type: 'SET_SENDING', value: true })
    expect(result.sending).toBe(true)
  })

  it('SET_SENDING sets sending back to false', () => {
    const state: FormState = { ...initialFormState, sending: true }
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
    expect(result).toEqual(initialFormState)
  })
})
