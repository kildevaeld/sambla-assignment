<script setup lang="ts">
import type { NumberQuestion } from '@/models'
import type { EditorEmits, EditorProps } from './editor'
import { InputNumber } from 'ant-design-vue'

defineEmits<EditorEmits<NumberQuestion>>()
defineProps<EditorProps<NumberQuestion>>()
</script>

<template>
  <InputNumber
    type="number"
    :value="value"
    @change="$emit('input', typeof $event === 'string' ? parseInt($event) : $event)"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    :name="question.name"
    :id="aria.editor"
    :aria-required="question.required"
    :aria-errormessage="aria.error"
    :aria-describedby="aria.hint"
  />
</template>
