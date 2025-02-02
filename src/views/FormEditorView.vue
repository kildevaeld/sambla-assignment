<script setup lang="ts">
import FormBuilder from '@/form-builder/FormBuilder.vue'
import type { FormDescription, NonEmptyArray, Question } from '@/models'
import { useFormsStore } from '@/stores/forms'
import { deepClone } from '@/util'
import { Flex, notification } from 'ant-design-vue'
import { onMounted, ref, watch } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import { useRoute } from 'vue-router'

const store = useFormsStore()
const route = useRoute()

const value = ref<FormDescription | undefined>(void 0)

const valid = ref(false)

onMounted(() => {
  value.value = store.forms.find((m) => m.id === route.params.id)
})

watch(
  () => route.params.id,
  (id) => {
    const found = store.forms.find((m) => m.id === id)
    value.value = found ? deepClone(found) : void 0
  },
)

watch(valid, (valid) => {
  if (!valid) {
    openNotification('Could not save form')
  }
})

function onChange(value: FormDescription<NonEmptyArray<Question>>, valid: boolean) {
  if (valid) {
    store.save({ ...value, id: route.params.id as string })
    openNotification('Form saved')
  }
}

function openNotification(message: string) {
  notification.open({
    key: 'form-editor',
    message,
    duration: 2,
  })
}
</script>

<template>
  <Flex class="form-editor">
    <div :class="!valid && 'invalid'" class="form">
      <FormBuilder v-model="value" @change="onChange" @validate="valid = $event" />
    </div>

    <VueJsonPretty v-if="valid" :data="value" />
    <div v-else>Invalid form</div>
  </Flex>
</template>

<style scoped>
.form {
  width: 500px;
  max-width: 100%;
  padding: 0.5rem;
}

/* .invalid {
  border: 1px solid red;
} */

@media only screen and (max-width: 768px) {
  /* For mobile phones: */
  .output {
    display: none;
  }
}
</style>
