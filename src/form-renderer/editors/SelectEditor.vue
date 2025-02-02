<script setup lang="ts" generic="T extends JsonValue = JsonValue">
import type { SelectQuestion } from '@/models'
import type { JsonValue } from '@/models'
import { Select, SelectOption } from 'ant-design-vue'
import { computed } from 'vue'
import type { EditorEmits, EditorProps } from './editor'

const $emit = defineEmits<EditorEmits<SelectQuestion<T>>>()
const { question, value: v } = defineProps<EditorProps<SelectQuestion<T>>>()

function onChange(value: string) {
  const found = question.items.find((item) => item.display === value)
  if (found) {
    $emit('input', found.value)
  }

  $emit('blur')
}

const value = computed(() => question.items.find((item) => item.value === v)?.display)
</script>

<template>
  <Select
    :value="value"
    @change="onChange($event as string)"
    :name="question.name"
    :id="aria.editor"
    :aria-required="question.required"
    :aria-errormessage="aria.error"
    :aria-describedby="aria.hint"
    style="width: 100%"
  >
    <SelectOption v-for="item in question.items" :key="item.display" :value="item.display">
      {{ item.display }}
    </SelectOption>
  </Select>
</template>
