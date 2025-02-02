<script setup lang="ts">
import Expander from '@/components/Expander.vue'
import { registry } from '@/form-renderer/editors'
import type { Question, QuestionKindKey } from '@/models'
import { createId } from '@/util'
import { ref, watch } from 'vue'
import FieldsRenderer from '../FieldsRenderer.vue'
import { useQuestionList } from '../form'
import ValidationEditor from './ValidationEditor.vue'

const {
  question: q = {
    type: 'text',
    name: 'question',
    label: 'New question',
    prefill: '',
  },
} = defineProps<{
  question: Question
}>()

const emit = defineEmits<{ change: [value: Question] }>()

const store = useQuestionList(
  [
    {
      id: createId(),
      type: 'select',
      name: 'type',
      label: 'Question type',
      required: true,
      items: [
        { value: 'text', display: 'Text' },
        { value: 'textarea', display: 'Textarea' },
        { value: 'number', display: 'Number' },
        { value: 'boolean', display: 'Boolean' },
        { value: 'question-list', display: 'Question list' },
      ],
    },
    {
      id: createId(),
      type: 'text',
      name: 'name',
      label: 'Name',
      required: true,
      prefill: '',
    },
    {
      id: createId(),
      type: 'text',
      name: 'label',
      label: 'Label',
      required: false,
      prefill: '',
    },
    {
      id: createId(),
      type: 'textarea',
      name: 'hint',
      label: 'Hint',
      required: false,
    },
    {
      id: createId(),
      type: 'boolean',
      name: 'required',
      label: 'Required',
      required: false,
      prefill: true,
    },
  ] as const,
  { ...q } as any,
)

const isValid = ref(store.validate())

watch(
  store.store,
  (value) => {
    const valid = store.validate()
    isValid.value = valid
    if (valid) {
      emit('change', JSON.parse(JSON.stringify(value)))
    }
  },
  { deep: true },
)

const aria = { hint: 'hint', error: 'error', editor: 'editor' }
</script>

<template>
  <div>
    <div :class="!isValid && 'invalid'">
      <FieldsRenderer :fields="store.fields.value" :value="store.store" validation-event="change" />
      <div>
        <label>Prefill</label>
        <component
          :is="registry[store.store.type as QuestionKindKey]"
          :value="(store.store as any).prefill"
          :aria="aria"
          :question="store.store as any"
          @input="(store.store as any).prefill = $event"
        />
      </div>
      <div>
        <label>Validation</label>
        <Expander
          ><ValidationEditor :kind="store.store.type" v-model="(store.store as any).validation"
        /></Expander>
      </div>
    </div>
  </div>
</template>
