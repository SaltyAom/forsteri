// @ts-ignore
import { h, registerComponent } from './index.ts'

registerComponent({
    component: 'forsteri-element',
    view: h('h1', null, 'Hello World')
})

let customElement = document.createElement('forsteri-element') as any,
    element = customElement.element

console.log(element)
