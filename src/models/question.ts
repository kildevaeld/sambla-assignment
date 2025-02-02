import type { JsonValue } from '@/models'
import type { CSSProperties } from 'vue'

export type NoValidation = Record<PropertyKey, never>

export type QuestionValueType<T, V> = { valueType: T; validation: V }

export type StringValue = QuestionValueType<string, { min?: number; max?: number; email?: boolean }>

export type JsonV = QuestionValueType<JsonValue, NoValidation>

export type QuestionKind = {
  text: StringValue
  textarea: StringValue
  number: QuestionValueType<number, { min?: number; max?: number }>
  'question-list': QuestionValueType<Question[], { min?: number; max?: number }>
  select: JsonV
  boolean: QuestionValueType<boolean, { on?: boolean }>
  'form-actions': QuestionValueType<DisplayItem<FormAction>[], NoValidation>
  json: JsonV
}

export type QuestionKindKey = keyof QuestionKind

export type FormAction = 'reset' | 'submit'

export interface QuestionBase<Q extends QuestionKindKey> {
  id: string
  name: string
  label: string
  type: Q
  required: boolean
  style?: CSSProperties
  prefill?: QuestionKind[Q]['valueType']
  validation?: QuestionKind[Q]['validation']
  hint?: string
}

export type TextQuestion = QuestionBase<'text'>
export type TextAreaQuestion = QuestionBase<'textarea'>
export type NumberQuestion = QuestionBase<'number'>
export type QuestionListQuestion = QuestionBase<'question-list'>
export type BooleanQuestion = QuestionBase<'boolean'>
export type JsonQuestion = QuestionBase<'json'>

export type FormActionsQuestion = QuestionBase<'form-actions'>

export interface DisplayItem<T> {
  value: T
  display: string
}

export interface SelectQuestion<T = JsonValue> extends QuestionBase<'select'> {
  items: DisplayItem<T>[]
}

export type Question =
  | TextQuestion
  | TextAreaQuestion
  | NumberQuestion
  | QuestionListQuestion
  | SelectQuestion<JsonValue>
  | BooleanQuestion
  | FormActionsQuestion
  | JsonQuestion

/**
 * Resolve the output value type for a question
 */
export type AnswerType<Q> =
  Q extends QuestionBase<infer K>
    ? Q['required'] extends true
      ? QuestionKind[K]['valueType']
      : QuestionKind[K]['valueType'] | undefined
    : never
