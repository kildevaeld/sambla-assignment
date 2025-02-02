<script setup lang="ts" generic="Q extends Question">
import type { AnswerType, Question } from '@/models'
import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { Flex, Tooltip, Typography } from 'ant-design-vue'
import { computed } from 'vue'
import type { EditorComponent } from './editors'
import { registry } from './editors'
import type { Field, ValidationEvent } from './form'

const {
  field,
  validationEvent = 'submit',
  showLabel = true,
} = defineProps<{
  field: Field<Q>
  validationEvent?: ValidationEvent
  showLabel?: boolean
}>()

const model = defineModel<AnswerType<Q>>()

const aria = computed(() => ({
  hint: `${field.id}-hint`,
  error: `${field.id}-error`,
  editor: field.id,
}))

function onInput(value: AnswerType<Q>) {
  if (field.errors.length) {
    field.clearErrors()
  }
  model.value = value

  if (validationEvent === 'input') field.validate()
}

function onBlur() {
  if (validationEvent === 'change') field.validate()
}
</script>

<template>
  <div class="field" :style="field.question.style">
    <Flex class="label" justify="space-between" align="center">
      <label v-if="showLabel" :for="field.id"
        >{{ field.question.label ?? field.question.name }}
        <span v-if="field.question.required">*</span></label
      >
      <Tooltip v-if="field.question.hint" :title="field.question.hint" :id="aria.hint">
        <InfoCircleOutlined />
      </Tooltip>
    </Flex>
    <div>
      <component
        @input="onInput"
        @blur="onBlur"
        :value="model"
        :is="registry[field.question.type] as EditorComponent<Q>"
        :question="field.question"
        :aria="aria"
      />
    </div>
    <ul :id="aria.error" class="errors" v-if="field.errors?.length">
      <li v-for="(error, idx) in field.errors" :key="idx">
        <Typography.Text strong type="danger">{{ error }}</Typography.Text>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.field > .label {
  margin-bottom: 4px;
  /* font-size: 16px; */
}
.field > ul.errors {
  padding: 0;
  margin: 8px 0;
}

.field > ul.errors > li {
  padding: 0;
}
</style>
