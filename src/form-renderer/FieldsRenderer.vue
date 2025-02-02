<script setup lang="ts" generic="T extends Field<Question>[]">
import type { Question } from '@/models'
import { toRef } from 'vue'
import FieldRenderer from './FieldRenderer.vue'
import type { Field, FieldsValue, ValidationEvent } from './form'

/**
 * Renders a list for questions
 */

const props = defineProps<{
  fields: T
  value?: FieldsValue<T>
  validationEvent?: ValidationEvent
}>()

const value = toRef(() => props.value)
</script>

<template>
  <div class="fields">
    <template v-for="field in fields" :key="field.id">
      <FieldRenderer
        class="field"
        :field="field"
        v-model="value![field.question.name]"
        :show-label="field.question.type != 'boolean'"
        :validation-event="validationEvent"
      />
    </template>
  </div>
</template>

<style scoped>
.fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
