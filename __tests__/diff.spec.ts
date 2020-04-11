// @ts-ignore
import { diff, h } from '../index.ts'

describe('Diffing', () => {
    it('should return false if it is children', () => {
        let diffed = diff(h('children'), h('h2'))

        expect(diffed).toEqual({
            nodeName: false,
            attributes: false,
            childNodes: false
        })
    })

    it('should return new node if nodeName is different', () => {
        let diffed = diff(h('h1'), h('h2'))

        expect(diffed).toEqual(h('h1'))
    })

    it("should return new node if it's different type", () => {
        let diffed = diff(h('h1'), 'Hello')

        expect(diffed).toEqual(h('h1'))
    })

    it('should return false if no diff found', () => {
        let diffed = diff(
            h('h1', {
                style: {
                    color: 'red',
                    fontSize: '16px'
                }
            }),
            h('h1', {
                style: {
                    color: 'red',
                    fontSize: '16px'
                }
            })
        )

        expect(diffed).toEqual({
            nodeName: false,
            attributes: false,
            childNodes: false
        })
    })

    it('should diff attributes', () => {
        let diffed = diff(
            h('h1', {
                style: {
                    color: 'red',
                    fontSize: '16px'
                }
            }),
            h('h1', {
                style: {
                    color: 'blue',
                    fontSize: '16px'
                }
            })
        )

        expect(diffed).toEqual({
            nodeName: false,
            attributes: {
                style: {
                    color: 'red'
                }
            },
            childNodes: false
        })
    })

    it('should diff string', () => {
        let diffed = diff(
            h('h1', null, 'Hello', 'Forsteri'),
            h('h1', null, 'Hello', 'World')
        )

        expect(diffed).toEqual({
            nodeName: false,
            attributes: false,
            childNodes: [false, 'Forsteri']
        })
    })

    it('should diff element', () => {
        let diffed = diff(
            h(
                'h1',
                null,
                'Hello',
                h('h1', { class: 'hello-world' }, 'again', 'Forsteri')
            ),
            h(
                'h1',
                null,
                'Hello',
                h('h1', { class: 'hello' }, 'again', 'World')
            )
        )

        expect(diffed).toEqual({
            nodeName: false,
            attributes: false,
            childNodes: [
                false,
                {
                    nodeName: false,
                    attributes: {
                        class: 'hello-world'
                    },
                    childNodes: [false, 'Forsteri']
                }
            ]
        })
    })

    it('should diff both text and element', () => {
        let diffed = diff(
            h(
                'h1',
                null,
                'Hello',
                h(
                    'h1',
                    { class: 'hello-world' },
                    'again',
                    'Forsteri',
                    h('section', { class: 'hello' }, 'Hello World'),
                    h(
                        'div',
                        { style: { color: 'red', fontSize: '16px' } },
                        'Hello'
                    )
                )
            ),
            h(
                'h1',
                null,
                'Hello',
                h(
                    'h1',
                    { class: 'hello' },
                    'again',
                    'World',
                    h('main', { class: 'hello' }, 'Hello World'),
                    h(
                        'div',
                        { style: { color: 'red', fontSize: '16px' } },
                        'World'
                    )
                )
            )
        )

        expect(diffed).toEqual({
            nodeName: false,
            attributes: false,
            childNodes: [
                false,
                {
                    nodeName: false,
                    attributes: {
                        class: 'hello-world'
                    },
                    childNodes: [
                        false,
                        'Forsteri',
                        {
                            nodeName: 'section',
                            attributes: {
                                class: 'hello'
                            },
                            childNodes: ['Hello World']
                        },
                        {
                            nodeName: false,
                            attributes: false,
                            childNodes: ['Hello']
                        }
                    ]
                }
            ]
        })
    })
})
