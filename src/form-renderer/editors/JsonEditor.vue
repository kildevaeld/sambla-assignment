<script setup lang="ts">
import type { JsonQuestion, JsonValue } from '@/models'
import JsonEditorVue from 'json-editor-vue'
import { Mode } from 'vanilla-jsoneditor'
import { ref, toRaw, watch } from 'vue'
import type { EditorEmits, EditorProps } from './editor'

const $emit = defineEmits<EditorEmits<JsonQuestion>>()
const props = defineProps<EditorProps<JsonQuestion>>()

const stringValue = ref<any>({})
const latestValidString = ref('{}')

watch(
  () => props.value,
  (value) => {
    const serialized = JSON.stringify(value, null, 2)
    if (latestValidString.value === serialized) {
      return
    }

    stringValue.value = toRaw(value) as JsonValue
  },
  { immediate: true },
)

function onInput(value: string) {
  try {
    const json = JSON.parse(value)
    latestValidString.value = JSON.stringify(json, null, 2)
    $emit('input', json)
  } catch {
    if (!value) {
      $emit('input', void 0 as unknown as JsonValue)
    }
  }
}

function onChange(args: { text: string }) {
  onInput(args.text)
}
</script>

<template>
  <JsonEditorVue
    v-model="stringValue"
    @change="onChange"
    :main-menu-bar="false"
    :navigation-bar="false"
    :mode="Mode.text"
    :stringified="false"
  />
</template>
