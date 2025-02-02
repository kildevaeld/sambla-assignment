<script setup lang="ts">
import { FormRenderer } from '@/form-renderer'
import type { FormDescription, NonEmptyArray, Question, Result } from '@/models'
import { createId } from '@/util'

const model = defineModel<FormDescription<NonEmptyArray<Question>>>()
const $emit = defineEmits<{
  change: [value: FormDescription, valid: boolean]
  validate: [valid: boolean]
}>()

const form = {
  id: createId(),
  name: 'Form Builder',
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
} satisfies FormDescription

function onChange(value: Result<typeof form>, valid: boolean) {
  $emit('change', value as Result<typeof form> & { id: string } as FormDescription, valid)
}
</script>

<template>
  <FormRenderer
    :form="form"
    v-model="model as Result<typeof form>"
    validation-mode="form"
    validate-on-mount
    @change="onChange"
    validation-event="input"
    @validate="$emit('validate', $event)"
  />
</template>
