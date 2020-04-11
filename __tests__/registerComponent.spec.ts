// @ts-ignore
import { registerComponent, h } from '../index.ts'

describe('Register Component', () => {
    it('Should register component', () => {
        let view = () => h('h1', null, 'Hello World')

        registerComponent({
            component: 'forsteri-element-1',
            view: view
        })

        expect(customElements.get('forsteri-element-1')).not.toBeUndefined()
    })

    it('Should contains element', () => {
        let view = () => h('h1', null, 'Hello World')

        registerComponent({
            component: 'forsteri-element-2',
            view
        })

        let customElement: any = document.createElement('forsteri-element-2'),
            _element: HTMLElement = customElement.element

        expect(_element.childNodes[0].nodeName).toEqual('H1')
    })

    it('Should contains fragment in others', () => {
        let mockedMessage = 'Hello World'

        let view = () => h('h1', null, h('fragment', null, mockedMessage))

        registerComponent({
            component: 'forsteri-element-3',
            view
        })

        let customElement: any = document.createElement('forsteri-element-3'),
            _element: HTMLElement = customElement.element

        expect(_element.childNodes[0].textContent).toEqual(mockedMessage)
    })

    it('Should contains fragment on root', () => {
        let view = () => h('fragment', null, h('h1', null, 'Hello World'))

        let h1 = document.createElement('h1')
        h1.appendChild(document.createTextNode('Hello World'))

        registerComponent({
            component: 'forsteri-element-4',
            view
        })

        let customElement: any = document.createElement('forsteri-element-4'),
            _element: HTMLElement = customElement.element

        expect(_element.childNodes[0].nodeName).toEqual('H1')
    })

    // it('Should reflect children', () => {
    //     let view = () => h('children')

    //     let h1 = document.createElement('h1')
    //     h1.appendChild(document.createTextNode('Hello World'))

    //     registerComponent({
    //         component: 'forsteri-element-5',
    //         view
    //     })

    //     let customElement: any = document.createElement('forsteri-element-5')

    //     customElement.appendChild(h1)

    //     let _element: HTMLElement = customElement.element

    //     expect(_element.childNodes[0].textContent).toEqual(h1.textContent)
    // })
})