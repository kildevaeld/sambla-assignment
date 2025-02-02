import type {
  DisplayItem,
  FormAction,
  FormDescription,
  NonEmptyArray,
  Question,
  QuestionKindKey,
} from './models'

export function createId() {
  try {
    return crypto.randomUUID()
  } catch {
    return Math.random().toString(36).substring(2, 9) + +new Date()
  }
}

export function deepClone<T>(object: T): T {
  try {
    return structuredClone(object)
  } catch {
    return JSON.parse(JSON.stringify(object))
  }
}

export interface JsonForm {
  form_name: string
  form_style: Record<string, string>
  form_fields: JsonFormField[]
  form_buttons: JsonFormButton[]
}

export interface JsonFormButton {
  button_name: string
  on_click: string
}

export interface JsonFormField {
  field_name: string
  field_type: string
  required: boolean
  sensitive?: boolean
  custom_validator_method?: string
  meta: Record<string, unknown>
  prefill?: string
  field_style?: Record<string, string>
}

export function loadFromJson(json: JsonForm) {
  const fields = json.form_fields.map(
    (m) =>
      ({
        id: createId(),
        name: m.field_name,
        label: m.field_name,
        required: m.required,
        prefill: m.prefill,
        type: (m.field_type === 'email' ? 'text' : m.field_type) as QuestionKindKey,
        validation: m.field_type === 'email' ? { email: true } : {},
        style: m.field_style ?? {},
      }) as Question,
  ) as NonEmptyArray<Question>

  const buttons = json.form_buttons.map(
    (m) =>
      ({
        value: m.on_click === 'formSubmit()' ? 'submit' : 'reset',
        display: m.button_name,
      }) satisfies DisplayItem<FormAction>,
  )

  return {
    id: createId(),
    name: json.form_name,
    buttons,
    fields,
    style: json.form_style ?? {},
  } satisfies FormDescription
}
