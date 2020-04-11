import h from '../pragma'

describe('pragma (h)', () => {
    it('should create blank vnode', () => {
        expect(h('h1')).toEqual({
            nodeName: 'h1',
            attributes: {},
            childNodes: []
        })
    })

    it('should create lower-case vnode', () => {
        expect(h('SECTION')).toEqual({
            nodeName: 'section',
            attributes: {},
            childNodes: []
        })
    })

    it('should create vnode with attributes', () => {
        expect(
            h('h1', {
                className: 'hello',
                tabIndex: 0
            })
        ).toEqual({
            nodeName: 'h1',
            attributes: {
                className: 'hello',
                tabIndex: 0
            },
            childNodes: []
        })
    })

    it('should create vnode with attributes', () => {
        expect(
            h('h1', {
                className: 'hello',
                tabIndex: 0
            })
        ).toEqual({
            nodeName: 'h1',
            attributes: {
                className: 'hello',
                tabIndex: 0
            },
            childNodes: []
        })
    })

    it('should create vnode with deep attributes', () => {
        expect(
            h('h1', {
                className: 'hello',
                tabIndex: 0,
                style: {
                    color: 'red',
                    fontSize: '16px'
                }
            })
        ).toEqual({
            nodeName: 'h1',
            attributes: {
                className: 'hello',
                tabIndex: 0,
                style: {
                    color: 'red',
                    fontSize: '16px'
                }
            },
            childNodes: []
        })
    })

    it('should contains single text ', () => {
        expect(h('h1', null, 'Hello World')).toEqual({
            nodeName: 'h1',
            attributes: false,
            childNodes: ['Hello World']
        })
    })

    it('should contains single vnode', () => {
        expect(h('h1', null, h('h1', null, 'Hello World'))).toEqual({
            nodeName: 'h1',
            attributes: false,
            childNodes: [
                {
                    nodeName: 'h1',
                    attributes: false,
                    childNodes: ['Hello World']
                }
            ]
        })
    })
})
