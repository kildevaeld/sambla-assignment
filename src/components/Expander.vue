<script setup lang="ts">
import { ref, watch } from 'vue'

const { expanded } = defineProps<{ expanded?: boolean }>()

const toggled = ref(expanded)

watch(
  () => expanded,
  (on) => {
    toggled.value = on
  },
)
</script>

<template>
  <div>
    <div>
      <button @click="toggled = !toggled" type="button">Expand</button>
    </div>
    <div v-if="toggled">
      <KeepAlive><slot /></KeepAlive>
    </div>
  </div>
</template>
