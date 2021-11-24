<template>
  <div ref="itemDom">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'VirtualItem',
  emits: ['updateHeight'],
  setup(props, ctx) {
    const itemDom = ref()

    onMounted(() => {
      ctx.emit('updateHeight', itemDom.value.offsetHeight)
    })

    return {
      itemDom
    }
  }
})
</script>
