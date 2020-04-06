type ForsteriVNode = ForsteriNode | string

interface ForsteriNode {
    nodeName: string | false
    attributes: Object | false
    childNodes: ForsteriVNode[] | false
}

interface ForsteriNode__EnsureDiff {
    nodeName: string
    attributes: Object
    childNodes: ForsteriNode[]
}

type ForsteriElement = ForsteriElement__EnsureElement | Text

interface ForsteriElement__EnsureElement extends HTMLElement {
    vnode?: ForsteriVNode
}

interface ForsteriElement__Fragment extends DocumentFragment {
    vnode?: ForsteriVNode
}

interface ForsteriElement__ReflectElement extends DocumentFragment {
    staticChild: ChildNode[]
    vnode?: ForsteriVNode
}

type Attributes__EnsureDiff = Record<
    string,
    string | number | boolean | Object | Function
>

type ForsteriComponent<
    StateType extends Object = {},
    PropsType extends readonly string[] = []
> = (
    state: State<StateType>,
    props: Record<PropsType[number], string>
) => ForsteriNode

interface State<StateType extends Object = {}> {
    state: StateType
    set: <T extends keyof StateType>(
        key: T,
        value: StateType[T]
    ) => StateType[T]
}

const h = (
        nodeName: string,
        attributes: Object | null = {},
        ...childNodes: ForsteriVNode[]
    ): ForsteriNode => ({
        nodeName: nodeName.toLowerCase(),
        attributes: attributes === null ? false : attributes,
        childNodes,
    }),
    keys = (object: Object) => Object.keys(object),
    isBlank = (object: Object) => keys(object).length,
    isBlankThenReturn = (object: Object) => (isBlank(object) ? object : false),
    isString = (value: any) => typeof value === 'string',
    compareAttributes = (
        attributes: Attributes__EnsureDiff,
        oldAttributes: Attributes__EnsureDiff
    ): Attributes__EnsureDiff => {
        let _attributes: Attributes__EnsureDiff = {},
            intersect = keys(attributes).filter((property) =>
                keys(oldAttributes).includes(property)
            )

        keys(oldAttributes).filter((property) => {
            if (!intersect.includes(property)) _attributes[property] = ''
        })

        intersect.forEach((property) => {
            if (typeof attributes[property] === 'object') {
                let comparedSubsetAttributes = compareAttributes(
                    attributes[property] as Attributes__EnsureDiff,
                    oldAttributes[property] as Attributes__EnsureDiff
                )

                return isBlank(comparedSubsetAttributes)
                    ? (_attributes[property] = comparedSubsetAttributes)
                    : null
            }

            if (typeof attributes[property] === 'function')
                if (
                    attributes[property].toString() !==
                    oldAttributes[property].toString()
                )
                    _attributes[property] = attributes[property]
                else return

            if (attributes[property] !== oldAttributes[property])
                return (_attributes[property] = attributes[property])
        })

        return _attributes
    },
    diff = (current: ForsteriVNode, old: ForsteriNode): ForsteriNode => {
        if (
            typeof current === 'string' ||
            typeof old === 'string' ||
            typeof current !== typeof old
        )
            return current as ForsteriNode__EnsureDiff

        if (current.nodeName !== old.nodeName)
            return current as ForsteriNode__EnsureDiff

        let _attributes = current.attributes,
            _childNodes = Array.apply(
                false,
                new Array((current.childNodes as ForsteriVNode[]).length)
            ) as ForsteriVNode[] | false[] | false

        if (typeof current.attributes === typeof old.attributes)
            _attributes = compareAttributes(
                current.attributes as Attributes__EnsureDiff,
                old.attributes as Attributes__EnsureDiff
            ) as Attributes__EnsureDiff
        ;(current.childNodes as ForsteriVNode[]).forEach((child, index) => {
            if (isString(child))
                return isString(
                    (old as ForsteriNode__EnsureDiff).childNodes[index]
                )
                    ? child !==
                      (old as ForsteriNode__EnsureDiff).childNodes[index]
                        ? ((_childNodes as ForsteriVNode[] | false[])[
                              index
                          ] = false)
                        : ((_childNodes as ForsteriVNode[] | false[])[
                              index
                          ] = false)
                    : ((_childNodes as ForsteriVNode[] | false[])[
                          index
                      ] = false)
            else if (
                isString((old as ForsteriNode__EnsureDiff).childNodes[index])
            )
                return ((_childNodes as ForsteriVNode[] | false[])[
                    index
                ] = child)

            let diffedNode = diff(
                child,
                (old as ForsteriNode__EnsureDiff).childNodes[index]
            )

            return keys(diffedNode)
                .map((key) => (diffedNode as any)[key])
                .filter((child) => child !== false).length
                ? ((_childNodes as ForsteriVNode[] | false[])[index] = false)
                : ((_childNodes as ForsteriVNode[] | false[])[
                      index
                  ] = diffedNode)
        })

        if (
            !(_childNodes as ForsteriVNode[]).filter(
                (child: ForsteriVNode | false) => child !== false
            ).length
        )
            _childNodes = false

        return {
            nodeName: false,
            attributes: isBlankThenReturn(_attributes),
            childNodes: isBlankThenReturn(_childNodes) as
                | ForsteriNode[]
                | false,
        }
    },
    applyAttributes = (
        attributes: Attributes__EnsureDiff,
        ref: ForsteriElement__EnsureElement,
        shallow = true
    ) => {
        keys(attributes).forEach((property) => {
            if (typeof attributes[property] === 'object')
                applyAttributes(
                    attributes[property] as Attributes__EnsureDiff,
                    (ref as any)[property] as ForsteriElement__EnsureElement,
                    false
                )
            else if (property.startsWith('on')) {
                let eventName = property.replace('on', '') as any

                eventName =
                    eventName.charAt(0).toLowerCase() +
                    eventName.slice(1, eventName.length)

                try {
                    ref.removeEventListener(
                        eventName,
                        (ref.vnode as any)[eventName]
                    )
                } catch (err) {
                    ref.addEventListener(
                        eventName,
                        attributes[property] as (event: Event) => any,
                        false
                    )
                }
            } else if (shallow)
                ref.setAttribute(property, attributes[property] as any)
            else (ref as any)[property] = attributes[property]
        })
    },
    create = (
        _element: ForsteriNode | string
    ): ForsteriElement | ForsteriElement__Fragment | Text => {
        if (isString(_element))
            return document.createTextNode(_element as string)

        let {
                nodeName,
                attributes,
                childNodes,
            } = _element as ForsteriNode__EnsureDiff,
            element:
                | ForsteriElement__EnsureElement
                | ForsteriElement__Fragment =
                nodeName === 'fragment'
                    ? document.createDocumentFragment()
                    : document.createElement(nodeName)

        if (nodeName !== 'fragment')
            applyAttributes(
                attributes as Attributes__EnsureDiff,
                element as ForsteriElement__EnsureElement
            )

        childNodes.forEach((child: ForsteriVNode) => {
            isString(child)
                ? element.appendChild(document.createTextNode(child as string))
                : element.appendChild(create(child as ForsteriNode))
        })

        let _vnode = mapFragment(_element as ForsteriNode__EnsureDiff).flat(
            Infinity
        )

        if (nodeName !== 'fragment')
            element.vnode = Object.assign(_element, { childNodes: _vnode })

        return element
    },
    mapFragment = (vnode: ForsteriNode__EnsureDiff): any[] => {
        /**
         * We only need to map 2 level for each vNode.
         * Mapping all the node is unnecessary since each vNode will map itself anyway.
         * At this rate, we only need to map what we need thus ensure more performant.
         */
        return vnode.childNodes.map((child) => {
            if (
                child.nodeName === 'fragment' &&
                (child as ForsteriNode__EnsureDiff).childNodes.length
            )
                return (child as ForsteriNode__EnsureDiff).childNodes.map(
                    (child) => {
                        if (child.nodeName === 'fragment')
                            return mapFragment(
                                child as ForsteriNode__EnsureDiff
                            )[0]

                        return child
                    }
                )

            return child
        })
    },
    render = (node: ForsteriNode, element: ShadowRoot) => {
        if (!element.children.length) return element.appendChild(create(node))

        let applyDiff = (node: ForsteriNode | string, ref: ForsteriElement) => {
            if (isString(node))
                if (ref.nodeName === '#text')
                    return node !== ref.textContent
                        ? ((ref as Text).textContent = node as string)
                        : null
                else
                    try {
                        return (ref.parentElement as ForsteriElement).replaceChild(
                            create(node),
                            ref
                        )
                    } catch (err) {
                        /* Root of Shadow DOM return parentElement as null */
                        return (ref.getRootNode() as ShadowRoot).replaceChild(
                            create(node),
                            ref.getRootNode().childNodes[0]
                        )
                    }

            let { nodeName, childNodes } = node as ForsteriNode__EnsureDiff,
                diffed = diff(
                    node as ForsteriNode,
                    (ref as ForsteriElement__EnsureElement)
                        .vnode as ForsteriNode
                )

            if (nodeName !== `${ref.nodeName}`.toLowerCase())
                try {
                    /* Can never be Fragment, use normal method */
                    return (ref.parentElement as ForsteriElement).replaceChild(
                        create(node),
                        ref
                    )
                } catch (err) {
                    /** Root of Shadow DOM return parentElement as null.
                     * In case of Fragment as root, we need to remove each one.
                     * We can't remove ref since ref is needed to point at other node.
                     * So, we remove everything except ref, thus replace ref as last operation.
                     **/

                    ref.getRootNode().childNodes.forEach((child) => {
                        if (!child.isSameNode(ref))
                            ref.getRootNode().removeChild(child)
                    })

                    ref.getRootNode().replaceChild(create(node), ref)

                    return
                }

            applyAttributes(
                diffed.attributes as Attributes__EnsureDiff,
                ref as ForsteriElement__EnsureElement
            )

            childNodes.forEach((child, index) =>
                typeof ref.childNodes[index] !== 'undefined'
                    ? applyDiff(child, ref.childNodes[index] as ForsteriElement)
                    : ref.appendChild(create(child))
            )

            if (childNodes.length >= ref.childNodes.length) return

            Array.apply(
                null,
                new Array(ref.childNodes.length - childNodes.length)
            )
                .map((_, index) => index + childNodes.length)
                .reverse()
                .forEach((index) => {
                    try {
                        ref.removeChild(ref.childNodes[index])
                    } catch (err) {
                        ;(ref.getRootNode() as ShadowRoot).removeChild(
                            ref.childNodes[index]
                        )
                    }
                })
        }

        applyDiff(node, element.childNodes[0] as ForsteriElement)
    },
    registerComponent = <
        StateType extends object = {},
        PropsType extends readonly string[] = []
    >(
        elementName: string,
        component: ForsteriComponent<StateType>,
        state?: StateType,
        props?: PropsType
    ) => {
        customElements.define(
            elementName,
            class Forsteri extends HTMLElement {
                element: ShadowRoot
                state: StateType
                props: any

                constructor() {
                    super()

                    this.state = Object.assign({}, state)
                    this.props = {}
                    props?.forEach((prop) => (this.props[prop] = ''))

                    this.element = this.attachShadow({
                        mode: 'closed',
                    })

                    let observer = new MutationObserver((mutationsList) =>
                        mutationsList.forEach(() => {
                            this.element
                                .querySelectorAll('children')
                                .forEach((element) => {
                                    let fragment = document.createDocumentFragment()

                                    this.childNodes.forEach((child) => {
                                        fragment.appendChild(
                                            child.cloneNode(true)
                                        )
                                    })

                                    if (element.parentElement !== null)
                                        element.parentElement.replaceChild(
                                            fragment,
                                            element
                                        )
                                    else
                                        this.element.replaceChild(
                                            fragment,
                                            element
                                        )
                                })
                        })
                    )

                    observer.observe(this, {
                        childList: true,
                        subtree: true,
                        characterData: true,
                        attributes: true,
                    })
                }

                static get observedAttributes() {
                    return typeof props !== 'undefined' ? props : []
                }

                attributeChangedCallback(
                    name: string,
                    __: string,
                    prop: string
                ) {
                    this.props[name] = prop

                    render(
                        component(
                            composeState(
                                this.state,
                                this.props,
                                component,
                                this.element
                            ),
                            this.props
                        ),
                        this.element
                    )
                }

                connectedCallback() {
                    render(
                        component(
                            composeState(
                                this.state,
                                this.props,
                                component,
                                this.element
                            ),
                            this.props
                        ),
                        this.element
                    )
                }
            }
        )
    },
    composeState = <
        StateType extends Object = {},
        PropsType extends readonly string[] = []
    >(
        state: StateType,
        props: PropsType,
        component: ForsteriComponent<StateType, PropsType>,
        element: ShadowRoot
    ): State<StateType> => {
        let _state: any = Object.assign({}, state),
            _props = Object.assign({}, props)

        return {
            state: _state,
            set: <T extends keyof StateType>(
                property: keyof StateType,
                value: StateType[T]
            ): StateType[T] => {
                _state[property] = value
                render(
                    component(
                        composeState(_state, _props, component, element),
                        _props as any
                    ),
                    element
                )
                return _state
            },
        }
    }

export { h, registerComponent, ForsteriComponent }

export default {
    h,
    registerComponent,
}
