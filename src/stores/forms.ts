import type { ValidationMode } from '@/form-renderer/FormRenderer.vue'
import type { ValidationEvent } from '@/form-renderer/form'
import type { FormDescription } from '@/models'
import { createId, loadFromJson } from '@/util'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import fixtureData from '../fixtures/test-form.json'

export const useFormsStore = defineStore('forms', () => {
  const forms = useLocalStorage<FormDescription[]>('forms', [
    loadFromJson(fixtureData),
    {
      // This is the same form definition used to define the form in the FormBuilder component
      // Which is used to generate the form definitions used in the FormRenderer
      id: createId(),
      name: 'Form Builder form',
      buttons: [],
      fields: [
        {
          id: createId(),
          type: 'text',
          name: 'name',
          label: 'Form name',
          required: true,
        },
        {
          id: createId(),
          type: 'json',
          name: 'style',
          label: 'Styling',
          required: false,
          hint: 'Custom style.Must be a CSS style object',
        },
        {
          id: createId(),
          type: 'json',
          name: 'meta',
          label: 'Meta',
          required: false,
          hint: 'Meta data associated with the form. Must be valid JSON.',
        },
        {
          id: createId(),
          type: 'form-actions',
          name: 'buttons',
          label: 'Form actions',
          required: false,
        },
        {
          id: createId(),
          type: 'question-list',
          name: 'fields',
          label: 'Fields',
          required: true,
          validation: {
            min: 1,
          },
        },
      ] as const,
    },
  ])

  function save(form: FormDescription) {
    const index = forms.value.findIndex((f) => f.id === form.id)
    if (~index) {
      forms.value[index] = form
    } else {
      forms.value.push(form)
    }
  }

  function remove(id: string) {
    forms.value = forms.value.filter((m) => m.id !== id)
  }

  return { forms, save, remove }
})

export const useFormDataStore = defineStore('formData', () => {
  const data = useLocalStorage<{ [key: string]: Record<string, unknown> }>('formData', {})

  function save(id: string, formData: Record<string, unknown>) {
    data.value[id] = formData
  }

  function load(id: string) {
    return data.value[id]
  }

  function remove(id: string) {
    data.value[id] = void 0 as unknown as Record<string, unknown>
  }

  return { data, save, load, remove }
})

export const useFormSettings = defineStore('formSettings', () => {
  const data = useLocalStorage<{
    validationEvent: ValidationEvent
    validationMode: ValidationMode
    showTitle: boolean
  }>('formSettings', {
    validationEvent: 'submit',
    validationMode: 'field',
    showTitle: true,
  })

  return { data }
})
