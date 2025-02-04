<script setup lang="ts">
import FormRenderer from '@/form-renderer/FormRenderer.vue'
import type { FormDescription, Result } from '@/models'
import { useFormDataStore, useFormSettings, useFormsStore } from '@/stores/forms'
import { Checkbox, Divider, Flex, Segmented, TypographyText } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import { useRoute } from 'vue-router'
import { notification } from 'ant-design-vue'

const store = useFormsStore()
const data = useFormDataStore()

const route = useRoute()

const form = computed(() => store.forms.find((m) => m.id === route.params.id))

const value = ref<Result<FormDescription> | undefined>(void 0)

const isValid = ref(true)
const errors = ref({} as any)

const formSettings = useFormSettings()

onMounted(() => {
  value.value = data.load(route.params.id as string) as Result<FormDescription>
})

function onChange(value: Record<string, unknown>) {
  data.save(route.params.id as string, value)
}

function onSubmit(value: Record<string, unknown>) {
  console.log('Submit', value)
  notification.open({
    message: 'Form submitted',
  })
}
</script>

<template>
  <div>
    <Flex gap="large" align="center">
      <Flex align="center">
        <TypographyText strong>Validation Event: </TypographyText>
        <Segmented
          v-model:value="formSettings.data.validationEvent"
          :options="['submit', 'input', 'change']"
        />
      </Flex>
      <Flex align="center">
        <TypographyText strong>Validation Mode: </TypographyText>
        <Segmented v-model:value="formSettings.data.validationMode" :options="['field', 'form']" />
      </Flex>
      <div><Checkbox v-model:checked="formSettings.data.showTitle">Show Title</Checkbox></div>
    </Flex>
    <Divider />
    <Flex gap="large" v-if="form">
      <div class="form">
        <FormRenderer
          :form="form"
          @change="onChange"
          @submit="onSubmit"
          @error="errors = $event"
          @validate="isValid = $event"
          v-model="value"
          :validate-on-mount="true"
          :show-title="formSettings.data.showTitle"
          :validation-event="formSettings.data.validationEvent"
          :validation-mode="formSettings.data.validationMode"
        />
      </div>
      <div>
        <div>Form valid: {{ isValid }}</div>
        <VueJsonPretty :data="value" />
        <div v-if="!isValid">
          <div>Errors</div>
          <VueJsonPretty :data="errors" />
        </div>
      </div>
    </Flex>
    <div v-else>
      <p>
        Could not load form with id: {{ $route.params.id }}. Return
        <RouterLink to="/">home</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.form {
  /* width: 320px; */
  max-width: 100%;
}
</style>
