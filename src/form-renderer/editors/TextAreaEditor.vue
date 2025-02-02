<script setup lang="ts">
import type { TextQuestion } from '@/models'
import type { EditorEmits, EditorProps } from './editor'
import { Textarea } from 'ant-design-vue'

defineEmits<EditorEmits<TextQuestion>>()
defineProps<EditorProps<TextQuestion>>()
</script>

<template>
  <Textarea
    :value="value"
    @input="$emit('input', ($event.target as HTMLInputElement).value)"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    :name="question.name"
    :id="aria.editor"
    :aria-required="question.required"
    :aria-errormessage="aria.error"
    :aria-describedby="aria.hint"
  ></Textarea>
</template>
