import type { AnswerType, FormDescription, Question, Result } from '@/models'
import {
  type ComputedRef,
  type MaybeRef,
  computed,
  reactive,
  shallowReactive,
  toRef,
  unref,
  useId,
} from 'vue'
import { createValidator } from './validation'

function createInitial<T extends Question[]>(form: T, defaultValue?: Partial<Result<T>>) {
  const ret = Object.fromEntries(
    form.map((m) => [m.name, m.prefill as AnswerType<typeof m> | undefined] as const),
  ) as Result<T>

  if (defaultValue) {
    return { ...ret, ...defaultValue }
  }

  return ret
}

export interface Field<Q> {
  question: Q
  id: string
  errors: string[]
  validate(): boolean
  clearErrors(): void
}

export type ValidationEvent = 'submit' | 'input' | 'change'

export type QuestionOf<T> = T extends Field<infer Q> ? Q : never
export type FieldsValue<T> = T extends Field<Question>[]
  ? {
      [K in keyof T as T[number]['question']['name']]: AnswerType<QuestionOf<T[K]>>
    }
  : never

/**
 * Headless management of questions
 * @param form
 * @param defaultValue
 * @returns
 */
export function useQuestionList<T extends Question[]>(
  form: MaybeRef<T> | ComputedRef<T> | T,
  defaultValue: Result<T> = {} as Result<T>,
) {
  const id = useId()

  const store = reactive(createInitial(unref(form), defaultValue))

  const errors = shallowReactive<{
    [K in keyof T as T[number]['name']]?: string[]
  }>({})

  const validator = computed(() => createValidator(unref(form)))

  function validate<F extends T[number]['name']>(field?: F) {
    let valid = true
    if (field) {
      const ret = validator.value[field]?.safeParse(store[field])
      if (ret?.success) {
        errors[field] = [] as never
      } else {
        valid = false
        errors[field] = ret.error?.issues.map((m: Zod.ZodIssue) => m.message) as never
      }
    } else {
      for (const [k, v] of Object.entries(validator.value)) {
        const ret = v?.safeParse(store[k])
        if (ret?.success) {
          errors[k as T[number]['name']] = [] as never
        } else if (ret?.error) {
          errors[k as T[number]['name']] = ret.error.issues.map(
            (m: Zod.ZodIssue) => m.message,
          ) as never
          valid = false
        }
      }
    }

    return valid
  }

  const fields = computed(() => {
    return unref(form).map((field) => ({
      question: field,
      id: `${id}-${field.name}`,
      validate: () => validate(field.name),
      errors: errors[field.name as T[number]['name']] ?? [],
      clearErrors: () => {
        errors[field.name as T[number]['name']] = [] as never
      },
    })) as { [K in keyof T]: Field<T[K]> }
  })

  function reset(value?: Partial<Result<T>>) {
    for (const k in errors) {
      errors[k as T[number]['name']] = [] as never
    }
    Object.assign(store, createInitial(unref(form), value as Result<T>))
  }

  function set(value: Partial<Result<T>>) {
    reset(value)
  }

  function isValid() {
    let valid = true
    for (const [k, v] of Object.entries(validator.value)) {
      const ret = v?.safeParse(store[k])
      if (!ret?.success) {
        valid = false
      }
    }

    return valid
  }

  return { fields, store, errors, validate, reset, set, isValid }
}

export function useFormState<T extends FormDescription<Question[]>>(
  form: MaybeRef<T> | ComputedRef<T>,
  initialValue?: Result<T>,
) {
  return useQuestionList(
    toRef(() => unref(form).fields),
    initialValue,
  )
}
