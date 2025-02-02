import type { CSSProperties } from 'vue'
import type { JsonValue, NonEmptyArray } from './helpers'
import type { AnswerType, DisplayItem, FormAction, Question } from './question'

export interface FormButton {
  label: string
  action: FormAction
}

export interface FormDescription<Q extends Question[] = NonEmptyArray<Question>> {
  id: string
  name: string
  style?: CSSProperties
  meta?: JsonValue
  fields: Q
  buttons: DisplayItem<FormAction>[]
}

/**
 * Get the fields (questions) of a form description
 */
export type FormFieldsT<T> = T extends FormDescription<infer Q> ? Q : never

/**
 * Get the result type of a form or a list of questions
 */
export type Result<T> =
  T extends FormDescription<infer Q>
    ? {
        [K in keyof Q as Q[number]['name']]: AnswerType<Q[K]>
      }
    : T extends Question[]
      ? {
          [K in keyof T as T[number]['name']]: AnswerType<T[K]>
        }
      : never

export type FieldNames<T extends FormDescription> =
  T extends FormDescription<infer Q> ? { [K in keyof Q]: Q[K]['name'] }[number] : never
