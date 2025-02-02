<script setup lang="ts">
import type { FormDescription } from '@/models'
import { useFormDataStore, useFormsStore } from '@/stores/forms'
import { createId, deepClone } from '@/util'
import {
  DeleteOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
} from '@ant-design/icons-vue'
import {
  Button,
  Flex,
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutSider,
  List,
  ListItem,
  ListItemMeta,
  TypographyLink,
} from 'ant-design-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const store = useFormsStore()
const formData = useFormDataStore()
const router = useRouter()

function newForm() {
  router.push(`/${createId()}`)
}

function deleteForm(id: string) {
  router.push('/')
  store.remove(id)
  formData.remove(id)
}

const collapsed = ref(false)
const showTggole = ref(false)

function onCollapse(on: boolean) {
  collapsed.value = on
}

function onBreakpoint(off: boolean) {
  showTggole.value = off
}

function editForm(id: string) {
  router.push(`/${id}/edit`)
}
</script>

<template>
  <Layout>
    <LayoutSider
      class="sidebar"
      theme="light"
      @collapse="onCollapse"
      @breakpoint="onBreakpoint"
      :collapsed="collapsed"
      breakpoint="lg"
      collapsed-width="0"
      :trigger="null"
      collapsible
      :width="300"
    >
      <div class="inner">
        <LayoutHeader style="background: #fff; padding: 0"
          ><Flex justify="space-between" align="center">
            <h3>Forms</h3>
            <Button @click="newForm">
              <template #icon>
                <PlusOutlined />
              </template>
              New Form
            </Button>
          </Flex>
        </LayoutHeader>
        <List :data-source="store.forms" item-layout="vertical">
          <template #renderItem="{ item }">
            <ListItem :key="item.id">
              <template #actions>
                <RouterLink :to="`/${item.id}`">
                  <EditOutlined />
                  Edit
                </RouterLink>
                <TypographyLink @click.prevent="deleteForm(item.id)">
                  <DeleteOutlined />
                  Delete
                </TypographyLink>
              </template>
              <div style="cursor: pointer" @click="editForm(item.id)">
                <ListItemMeta>
                  <template #title>{{ item.name }}</template>
                </ListItemMeta>
              </div>
            </ListItem>
          </template>
        </List>
      </div>
    </LayoutSider>
    <Layout>
      <LayoutHeader style="background: #fff; padding: 0">
        <Flex vertical justify="center" align="start" style="height: 100%">
          <Flex align="center" :gap="10">
            <div v-show="showTggole">
              <menu-unfold-outlined
                v-if="collapsed"
                style="font-size: 24px"
                class="trigger"
                @click="() => (collapsed = !collapsed)"
              />
              <menu-fold-outlined
                style="font-size: 24px"
                v-else
                class="trigger"
                @click="() => (collapsed = !collapsed)"
              />
            </div>
          </Flex>
        </Flex>
      </LayoutHeader>
      <LayoutContent style="background-color: white">
        <RouterView />
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<style scoped>
.sidebar {
  padding: 0 12px;
}
.sidebar .inner {
  position: sticky;
  top: 0;
}
</style>
