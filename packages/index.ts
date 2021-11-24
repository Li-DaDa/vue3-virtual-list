import { App } from 'vue'
import VirtualList from './src/VirtualList.vue'

VirtualList.install = (app: App): void => {
  app.component(VirtualList.name, VirtualList)
}

export default VirtualList
