// 为组件提供 install 方法，供组件对外按需引入
import McTest from './src/test'
McTest.install = Vue => {
  Vue.component(McTest.name, McTest)
}
export default McTest
