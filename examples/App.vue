<template>
  <div style="width: 300px; height: 500px; margin: 50px auto">
    <virtual-list :items="items" itemKey="id">
      <template v-slot="{ item, index }">
        <div style="padding: 50px 0; border-bottom: 1px solid #eee">index:{{ index }}-{{ item.name }}</div>
      </template>
    </virtual-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import VirtualList from '../packages'

interface IItem {
  name: string
  id: number
}

export default defineComponent({
  name: 'App',
  components: {
    VirtualList
  },
  setup() {
    const items = ref<IItem[]>([])

    onMounted(() => {
      const list: IItem[] = []
      for (let i = 0; i < 10000; i++) {
        list.push({
          name: 'item_' + i,
          id: i
        })
      }
      items.value = list
    })

    return {
      items
    }
  }
})
</script>
