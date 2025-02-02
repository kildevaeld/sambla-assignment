<script setup lang="ts">
import AddButton from '@/components/AddButton.vue'
import RemoveButton from '@/components/RemoveButton.vue'
import type { DisplayItem, FormAction, FormActionsQuestion } from '@/models'
import { Input, Select, SelectOption } from 'ant-design-vue'
import { toRaw, watch, ref } from 'vue'
import type { EditorEmits, EditorProps } from './editor'

const props = defineProps<EditorProps<FormActionsQuestion>>()
const $emit = defineEmits<EditorEmits<FormActionsQuestion>>()

const value = ref([] as DisplayItem<FormAction>[])

function onAdd() {
  value.value.push({
    value: 'submit',
    display: 'Submit',
  })
}

function onRemove(idx: number) {
  value.value = value.value?.filter((_, i) => i !== idx)
}

watch(
  value,
  () => {
    $emit('input', toRaw(value.value))
  },
  { deep: true },
)

watch(
  () => props.value,
  (v) => {
    if (toRaw(v) === toRaw(value.value)) return
    value.value = toRaw(v) ?? []
  },
)
</script>

<template>
  <div>
    <ul>
      <li v-for="(action, index) in value" :key="index">
        <RemoveButton class="remove-button" @click="onRemove(index)" />
        <Select v-model:value="action.value">
          <SelectOption value="submit">Submit</SelectOption>
          <SelectOption value="reset">Reset</SelectOption>
        </Select>
        <Input v-model:value="action.display" />
      </li>
      <li>
        <AddButton @click="onAdd">Add</AddButton>
      </li>
    </ul>
  </div>
</template>

<style>
ul {
  list-style: none;
}
ul > li {
  position: relative;
  padding: 24px 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.remove-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
