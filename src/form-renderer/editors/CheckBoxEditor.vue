<script setup lang="ts">
import { Checkbox } from 'ant-design-vue'
import type { EditorEmits, EditorProps } from './editor'
import type { BooleanQuestion } from '@/models'
defineEmits<EditorEmits<BooleanQuestion>>()
defineProps<EditorProps<BooleanQuestion>>()
</script>

<template>
  <Checkbox
    :checked="value"
    @update:checked="$emit('input', $event)"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    :name="question.name"
    :id="aria.editor"
    :aria-required="question.required"
    :aria-errormessage="aria.error"
    :aria-describedby="aria.hint"
    >{{ question.label }}</Checkbox
  >
</template>
