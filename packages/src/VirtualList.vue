<template>
  <div class="dv-virtual-list" ref="rootDom" @scroll.passive="scrollHandler">
    <div ref="containerDom" :style="{ height: containerHeight + 'px' }">
      <div :style="{ height: topPosHeight + 'px' }"></div>
      <virtual-item
        v-for="item in data"
        :key="(itemKey && item.item[itemKey]) || item.index"
        @updateHeight="updateHeight($event, item)"
      >
        <slot :item="item.item" :index="item.index"></slot>
      </virtual-item>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, nextTick } from 'vue'
import VirtualItem from './VirtualItem.vue'

interface ItemType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

export default defineComponent({
  name: 'DlVirtualList',
  components: {
    VirtualItem
  },
  props: {
    items: {
      // 原始列表数据
      required: true,
      type: Array
    },
    distance: {
      // 触发startIndex变更的间距，顶部条数
      default: 10,
      type: Number
    },
    showLength: {
      default: 30,
      type: Number
    },
    itemHeight: {
      type: Number,
      default: 0
    },
    itemKey: String
  },
  setup(props) {
    const rootDom = ref()
    const containerDom = ref()
    // 显示的区域索引
    const pos = ref([0, props.showLength as number])
    // 保存列表高度
    const itemCache = ref<{ [key: string]: { height?: number } }>({})
    // 列表默认高度
    let itemHeight = props.itemHeight as number

    // 根据前后索引位置获取显示的数据
    const data = computed(() => {
      const items = (props.items as ItemType[]) || []
      const endIndex = Math.min(pos.value[1], items.length)
      return items.slice(pos.value[0], endIndex).map((item, index) => ({ index: index + pos.value[0], item }))
    })

    // 更新列表高度缓存数据
    const updateHeight = (height: number, item: ItemType) => {
      if (!itemHeight) {
        itemHeight = height
      }
      if (!itemCache.value[item.index]) {
        itemCache.value[item.index] = {}
      }
      itemCache.value[item.index].height = height
    }

    // 滚动区域列表容器高度
    const containerHeight = computed(() => {
      let height = 0
      const len = ((props.items as ItemType[]) || []).length
      for (let i = 0; i < len; i++) {
        if (itemCache.value[i]) {
          height += itemCache.value[i].height || itemHeight
        } else {
          height += itemHeight
        }
      }
      return height
    })

    // 滚动函数
    let inScroll = false
    const scrollHandler = (e: WheelEvent) => {
      if (!rootDom.value) return
      if (inScroll) return
      inScroll = true
      requestAnimationFrame(() => {
        inScroll = false
        // 计算起始位置
        getIndex((e.target as HTMLElement).scrollTop)
      })
    }

    // 顶部占位元素高度
    const topPosHeight = computed(() => {
      let height = 0
      for (let i = 0; i < pos.value[0]; i++) {
        height += (itemCache.value[i] && itemCache.value[i].height) || itemHeight
      }
      return height
    })

    // 计算数据索引
    const getIndex = (scrollTop: number) => {
      let tmpHeight = 0
      let start = 0
      while (tmpHeight < scrollTop) {
        tmpHeight += (itemCache.value[start] && itemCache.value[start].height) || itemHeight
        start++
      }
      pos.value[0] = Math.max(0, start - (props.distance as number))
      pos.value[1] = pos.value[0] + (props.showLength as number)
    }

    // 设置滚动位置
    const setScrollPos = (pos: number) => {
      nextTick(() => {
        rootDom.value.scrollTop = pos
      })
    }

    // 获取滚动位置
    const getScrollPos = () => {
      return rootDom.value.scrollTop
    }

    return {
      rootDom,
      containerDom,
      data,
      containerHeight,
      topPosHeight,
      updateHeight,
      scrollHandler,
      setScrollPos,
      getScrollPos
    }
  }
})
</script>

<style lang="scss">
.dv-virtual-list {
  height: 100%;
  overflow: auto;
}
</style>
