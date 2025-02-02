import type { Question, QuestionKindKey } from '@/models'
import { createId } from '@/util'
/**
 * Definitions for constructing validation forms
 */

const rangeValidation = [
  {
    id: createId(),
    type: 'number',
    name: 'min',
    label: 'Min',
    required: false,
  },
  {
    id: createId(),
    type: 'number',
    name: 'max',
    label: 'Max',
    required: false,
  },
] as const satisfies Question[]

const textValidation = [
  {
    id: createId(),
    type: 'boolean',
    name: 'email',
    label: 'Email',
    required: false,
  },
  ...rangeValidation,
] as const satisfies Question[]

export const validations = {
  text: textValidation,
  textarea: textValidation,
  number: rangeValidation,
  json: [] as const satisfies Question[],
  'question-list': rangeValidation,
  select: [] as const satisfies Question[],
  'form-actions': rangeValidation,
  boolean: [] as const satisfies Question[],
} as const satisfies { [K in QuestionKindKey]: Question[] }
