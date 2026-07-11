export interface FormState {
  name: string
  email: string
  subject: string
  message: string
  sending: boolean
}

export type FormField = keyof Omit<FormState, 'sending'>

export type FormAction =
  | { type: 'SET_FIELD'; field: FormField; value: string }
  | { type: 'SET_SENDING'; value: boolean }
  | { type: 'RESET' }

export const initialFormState: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  sending: false,
}

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_SENDING':
      return { ...state, sending: action.value }
    case 'RESET':
      return initialFormState
    default:
      return state
  }
}
