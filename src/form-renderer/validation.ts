import type { Question } from '@/models'
import { z } from 'zod'

export function createValidator<T extends Question[]>(form: T) {
  return Object.fromEntries(
    form.map((m) => {
      const validation = createQuestionValidation(m)
      return [m.name, m.required ? validation : z.optional(validation)]
    }),
  )
}

export function createQuestionValidation<Q extends Question>(question: Q) {
  switch (question.type) {
    case 'textarea':
    case 'text': {
      let val = z.string()
      if (question.validation?.email) {
        val = val.email()
      }
      if (question.validation?.min) {
        val = val.min(question.validation.min)
      }

      if (question.validation?.max) {
        val = val.max(question.validation.max)
      }

      if (question.required) {
        val = val.nonempty()
      }
      return val
    }
    case 'number': {
      let val = z.number()
      if (question.validation?.min) {
        val = val.min(question.validation.min)
      }

      if (question.validation?.max) {
        val = val.max(question.validation.max)
      }
      return val
    }
    case 'question-list': {
      let val = z.array(
        z.object({
          name: z.string(),
          label: z.string(),
        }),
      )
      if (question.validation?.min) {
        val = val.min(question.validation.min)
      }

      if (question.validation?.max) {
        val = val.max(question.validation.max)
      }

      return val
    }
    case 'select': {
      return z.any()
    }
    case 'boolean': {
      return z.boolean()
    }
    default:
      return z.any()
  }
}
