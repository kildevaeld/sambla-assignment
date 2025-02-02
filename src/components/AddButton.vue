<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue'
import { Button } from 'ant-design-vue'
import type { CSSProperties } from 'vue'

defineProps<{ style?: CSSProperties; class?: string }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <Button @click.prevent="$emit('click')" :style="style" :class="$props.class">
    <template #icon>
      <PlusOutlined />
    </template>
    <template #default>
      <slot />
    </template>
  </Button>
</template>
