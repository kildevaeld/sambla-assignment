<script setup lang="ts" generic="T extends FormDescription<Question[]>">
import type { FormAction, FormDescription, FormFieldsT, Question, Result } from '@/models'
import { deepClone } from '@/util'
import { Button, Space, TypographyTitle } from 'ant-design-vue'
import { computed, onMounted, toRaw, toRef, watch } from 'vue'
import FieldsRenderer from './FieldsRenderer.vue'
import { useFormState } from './form'
import type { ValidationEvent } from './form'

export type ValidationMode = 'field' | 'form'

const props = defineProps<{
  form: T
  merge?: boolean
  validationEvent?: ValidationEvent
  showTitle?: boolean
  validationMode?: ValidationMode
  validateOnMount?: boolean
}>()

const emit = defineEmits<{
  change: [value: Result<T>, valid: boolean]
  submit: [value: Result<T>]
  validate: [valid: boolean]
  error: [errors: { [K in keyof FormFieldsT<T> as FormFieldsT<T>[number]['name']]: string[] }]
}>()

const model = defineModel<Result<T>>()

const { fields, store, reset, validate, isValid, errors } = useFormState(toRef(() => props.form))

const value = computed(() => deepClone(store) as Result<T>)

function onAction(action: FormAction) {
  switch (action) {
    case 'reset':
      reset()
      break
    case 'submit':
      if (validate()) {
        emit('submit', value.value as Result<T>)
      }
      break
  }
}

watch(errors, (errors) => {
  emit(
    'error',
    toRaw(errors) as { [K in keyof FormFieldsT<T> as FormFieldsT<T>[number]['name']]: string[] },
  )
})

watch(
  value,
  (value) => {
    const valid = props.validationMode !== 'form' ? isValid() : validate()
    model.value = value
    emit('validate', valid)
    emit('change', value, valid)
  },
  { deep: true },
)

onMounted(() => {
  if (props.validateOnMount) {
    emit('validate', props.validationMode !== 'form' ? isValid() : validate())
  }
})

watch(model, (model) => {
  if (toRaw(model) === toRaw(value.value)) {
    return
  }

  reset(toRaw(model))
})
</script>

<template>
  <div>
    <TypographyTitle :level="3" v-if="showTitle">
      {{ form.name }}
    </TypographyTitle>
    <form :style="form.style">
      <FieldsRenderer :fields="fields" :value="store" :validation-event="validationEvent" />
      <Space style="margin-top: 16px">
        <template v-for="(btn, idx) in form.buttons" :key="idx">
          <Button
            :type="btn.value == 'submit' ? 'primary' : 'default'"
            @click.prevent="onAction(btn.value)"
          >
            {{ btn.display }}
          </Button>
        </template>
      </Space>
    </form>
  </div>
</template>
