// @ts-ignore
import { create, h } from '../index.ts'

describe('Create', () => {
    it('Should create node', () => {
        let h1 = document.createElement('h1')

        expect(create(h('h1'))).toEqual(h1)
    })

    it('Should have attributes', () => {
        let h1 = document.createElement('h1')
        h1.classList.add('hello')
        h1.style.color = 'red'

        expect(
            create(
                h('h1', {
                    class: 'hello',
                    style: {
                        color: 'red'
                    }
                })
            )
        ).toEqual(h1)
    })

    it('Should have children', () => {
        let section = document.createElement('section'),
            h1 = document.createElement('h1')

        h1.classList.add('hello')
        h1.appendChild(document.createTextNode('hello'))

        section.appendChild(document.createTextNode('Forsteri'))
        section.appendChild(h1)

        expect(
            create(
                h(
                    'section',
                    null,
                    'Forsteri',
                    h('h1', { class: 'hello' }, 'hello')
                )
            )
        ).toEqual(section)
    })

    it('Should convert fragment to children', () => {
        let section = document.createElement('section')

        section.appendChild(document.createTextNode('Hello'))
        section.appendChild(document.createTextNode('Forsteri'))

        expect(
            create(h('section', null, h('fragment', null, 'Hello', 'Forsteri')))
        ).toEqual(section)
    })

    it('Should contains <children />', () => {
        let section = document.createElement('section')

        section.appendChild(document.createTextNode('Hello'))
        section.appendChild(document.createElement('children'))

        expect(
            create(
                h('section', null, h('fragment', null, 'Hello', h('children')))
            )
        ).toEqual(section)
    })
})
