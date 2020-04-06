type ForsteriVNode = ForsteriNode | string

interface ForsteriNode {
    nodeName: string | false
    attributes: Object | false
    childNodes: ForsteriVNode[] | false
}

const createElement = (
    nodeName: string,
    attributes: Object | null = {},
    ...childNodes: ForsteriVNode[]
): ForsteriNode => ({
    nodeName: nodeName.toLowerCase(),
    attributes: attributes === null ? false : attributes,
    childNodes
})

export default createElement