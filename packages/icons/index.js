// 为组件提供 install 方法，供组件对外按需引入
import McIcon from './src/icons'
McIcon.install = Vue => {
  Vue.component(McIcon.name, McIcon)
}
export default McIcon
