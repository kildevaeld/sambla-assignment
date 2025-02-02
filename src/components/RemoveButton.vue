<script setup lang="ts">
import { CloseOutlined } from '@ant-design/icons-vue'
import type { CSSProperties } from 'vue'

const { size = 12, style } = defineProps<{ size?: number; style?: CSSProperties; class?: string }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button type="button" @click.prevent="$emit('click')" :style="style" :class="$props.class">
    <CloseOutlined :style="`font-size: ${size}px`" />
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
  background: none;
  border: none;
}
</style>
