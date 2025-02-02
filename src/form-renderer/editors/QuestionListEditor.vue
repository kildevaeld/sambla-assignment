<script setup lang="ts">
import AddButton from '@/components/AddButton.vue'
import RemoveButton from '@/components/RemoveButton.vue'
import type { QuestionListQuestion, TextQuestion } from '@/models'
import { createId, deepClone } from '@/util'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import { Card } from 'ant-design-vue'
import { ref, toRaw, toRef, watch } from 'vue'
import draggable from 'vuedraggable'
import FormItem from './QuestionEditor.vue'
import type { EditorEmits, EditorProps } from './editor'

const props = defineProps<EditorProps<QuestionListQuestion>>()
const $emit = defineEmits<EditorEmits<QuestionListQuestion>>()

const dragging = ref(false)

const questions = toRef(deepClone(props.value) ?? [])

function add() {
  questions.value.push({
    name: 'question',
    label: 'New Question',
    type: 'text',
    required: false,
    validation: {},
    id: createId(),
  } as TextQuestion)
}

function onRemove(idx: number) {
  questions.value = questions.value?.filter((_, i) => i !== idx)
}

watch(
  questions,
  (value) => {
    $emit('input', toRaw(value))
  },
  { deep: true },
)

watch(
  () => props.value,
  (v) => {
    if (toRaw(v) === toRaw(questions.value)) return
    questions.value = toRaw(v) ?? []
  },
)

const dragOptions = {
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}
</script>

<template>
  <div>
    <draggable
      class="list"
      :list="questions"
      item-key="id"
      handle=".handle"
      @start="dragging = true"
      @end="dragging = false"
      v-bind="dragOptions"
      tag="ul"
    >
      <template #item="{ element, index }">
        <li class="list__item">
          <div class="list__item__header">
            <div class="handle">
              <ellipsis-outlined />
            </div>
            <RemoveButton class="remove-button" @click="onRemove(index)" />
          </div>
          <card>
            <form-item :question="element" @change="questions[index] = $event"></form-item>
          </card>
        </li>
      </template>
    </draggable>
    <AddButton block @click="add">Add question</AddButton>
  </div>
</template>

<style scoped>
.ghost {
  opacity: 0.5;
}

.list {
  list-style: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  /* gap: 20px; */
}

.list__item .handle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  /* background-color: gray; */
  height: 24px;
  width: 50px;
  font-size: 24px;
}

.list__item__header {
  position: relative;
}

.list__item__header .remove-button {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
