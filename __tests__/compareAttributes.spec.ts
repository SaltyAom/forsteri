// @ts-ignore
import { compareAttributes } from '../index.ts'

describe('Compare Attributes', () => {
    it('should return blank if attributes is equal', () => {
        expect(
            compareAttributes(
                {
                    className: 'hello'
                },
                {
                    className: 'hello'
                }
            )
        ).toEqual({})
    })

    it('should return differece', () => {
        expect(
            compareAttributes(
                {
                    className: 'hello',
                    value: 'a'
                },
                {
                    className: 'hello-world',
                    value: 'b'
                }
            )
        ).toEqual({
            className: 'hello',
            value: 'a'
        })
    })

    it('should find deep differece', () => {
        expect(
            compareAttributes(
                {
                    className: 'hello-world',
                    style: {
                        color: 'red',
                        fontSize: '16px'
                    }
                },
                {
                    className: 'hello-world',
                    style: {
                        color: 'blue',
                        fontSize: '16px'
                    }
                }
            )
        ).toEqual({
            style: {
                color: 'red'
            }
        })
    })
})
