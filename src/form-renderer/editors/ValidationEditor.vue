<script setup lang="ts" generic="Q extends QuestionKindKey">
import type { QuestionKind, QuestionKindKey } from '@/models'
import { toRef, watch } from 'vue'
import FieldsRenderer from '../FieldsRenderer.vue'
import { useQuestionList } from '../form'
import { validations } from './validation'

const props = defineProps<{ kind: QuestionKindKey }>()

const model = defineModel<QuestionKind[Q]['validation']>()

const { store, fields, reset } = useQuestionList(toRef(() => validations[props.kind]))

watch(store, (value) => {
  model.value = value as Record<string, unknown>
})

watch(model, (value) => {
  reset(value)
})
</script>

<template>
  <template v-if="fields.length">
    <FieldsRenderer :fields="fields" :value="store as any" />
  </template>
</template>
