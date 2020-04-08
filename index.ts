type ForsteriVNode = ForsteriNode | string

interface ForsteriNode<T = Object> {
    nodeName: string | false
    attributes: Object | false
    childNodes: ForsteriVNode[] | false
}

interface ForsteriNode__EnsureDiff<T = Object> {
    nodeName: string
    attributes: T
    childNodes: ForsteriNode[]
}

type ForsteriElement = ForsteriElement__EnsureElement | Text

interface ForsteriElement__EnsureElement extends HTMLElement {
    vnode?: ForsteriVNode
    events?: any
}

interface ForsteriElement__Fragment extends DocumentFragment {
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
    update: <T extends keyof StateType>(
        key: T,
        value: Partial<StateType[T]> & Object
    ) => StateType[T]
    on: (
        property: true | Array<keyof StateType>,
        callback: (newState: StateType) => void
    ) => void
}

const h = (
        nodeName: string,
        attributes: Object | null = {},
        ...childNodes: ForsteriVNode[]
    ): ForsteriNode => ({
        nodeName: nodeName === null ? 'fragment' : nodeName.toLowerCase(),
        attributes: attributes === null ? false : attributes,
        childNodes
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

            /* State doesn't reflect, need a clean up */
            if (property.startsWith('on'))
                return (_attributes[property] = attributes[property])

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
        if (typeof current !== 'string' && current.nodeName === 'children')
            return {
                nodeName: false,
                attributes: false,
                childNodes: false
            }

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

            /* Child Diff */
        ;(current.childNodes as ForsteriVNode[]).forEach((child, index) => {
            if (isString(child)) {
                let _old = (old as ForsteriNode__EnsureDiff).childNodes[index]

                if (isString(_old))
                    return child !== _old
                        ? ((_childNodes as ForsteriVNode[] | false[])[
                              index
                          ] = child)
                        : ((_childNodes as ForsteriVNode[] | false[])[
                              index
                          ] = false)
                else (_childNodes as ForsteriVNode[] | false[])[index] = child
            } else if (
                isString((old as ForsteriNode__EnsureDiff).childNodes[index])
            )
                return ((_childNodes as ForsteriVNode[] | false[])[
                    index
                ] = child)
            else if (
                (child as ForsteriNode__EnsureDiff).nodeName === 'children'
            )
                return ((_childNodes as ForsteriVNode[] | false[])[
                    index
                ] = false)

            let diffedNode = diff(
                child,
                (old as ForsteriNode__EnsureDiff).childNodes[index]
            )

            return (
                keys(diffedNode)
                    .map((key) => (diffedNode as any)[key])
                    // If every key (nodeName, attributes, childNodes is false)
                    .filter((child) => child === false).length === 3
                    ? ((_childNodes as ForsteriVNode[] | false[])[
                          index
                      ] = false)
                    : ((_childNodes as ForsteriVNode[] | false[])[
                          index
                      ] = diffedNode)
            )
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
            childNodes: isBlankThenReturn(_childNodes) as ForsteriNode[] | false
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

                if (typeof ref.events === 'undefined') ref.events = {}

                try {
                    ref.removeEventListener(
                        eventName,
                        ref.events[eventName],
                        false
                    )
                } catch (err) {
                } finally {
                    ref.addEventListener(
                        eventName,
                        attributes[property] as (event: Event) => any,
                        false
                    )
                }

                ref.events[eventName] = attributes[property]
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
                childNodes
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
    render = (
        node: ForsteriNode,
        element: ShadowRoot | ForsteriElement__EnsureElement
    ) => {
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

            let { nodeName, childNodes } = node as ForsteriNode__EnsureDiff

            if (
                typeof ref === 'undefined' ||
                typeof (ref as any).vnode === 'undefined'
            )
                return

            let diffed = diff(
                node as ForsteriNode,
                (ref as ForsteriElement__EnsureElement).vnode as ForsteriNode
            )

            if (nodeName === 'children') return

            if (nodeName !== `${ref.nodeName}`.toLowerCase())
                if (ref.parentElement !== null)
                    return (ref.parentElement as ForsteriElement).replaceChild(
                        create(node),
                        ref
                    )
                else
                    return (ref.getRootNode() as ForsteriElement).replaceChild(
                        create(node),
                        ref
                    )

            applyAttributes(
                diffed.attributes as Attributes__EnsureDiff,
                ref as ForsteriElement__EnsureElement
            )

            childNodes.forEach((child, index) => {
                if (typeof ref.childNodes[index] !== 'undefined') {
                    if (
                        typeof ((ref as ForsteriElement__EnsureElement)
                            .vnode as ForsteriNode__EnsureDiff).childNodes[
                            index
                        ].nodeName === 'undefined' ||
                        (((ref as ForsteriElement__EnsureElement)
                            .vnode as ForsteriNode__EnsureDiff).childNodes[
                            index
                        ].nodeName as string).toLowerCase() !== 'children'
                    )
                        applyDiff(
                            child,
                            ref.childNodes[index] as ForsteriElement
                        )
                } else ref.appendChild(create(child))
            })

            let _childNodesWithoutFragment = childNodes.filter(({ nodeName }) => nodeName !== "fragment")

            if (_childNodesWithoutFragment.length >= ref.childNodes.length) return

            let cleanup = () =>
                Array.apply(
                    null,
                    new Array(ref.childNodes.length - _childNodesWithoutFragment.length)
                )
                    .map((_, index) => index + _childNodesWithoutFragment.length)
                    .reverse()
                    .forEach((index) => {
                        ref.removeChild(ref.childNodes[index])
                    })

            /* Remove child in-case of old child which over */
            /* Don't remove children */
            try {
                if (
                    (((ref as ForsteriElement__EnsureElement)
                        .vnode as ForsteriNode__EnsureDiff).childNodes[0]
                        .nodeName as string).toLowerCase() !== 'children'
                )
                    cleanup()
            } catch (err) {
                cleanup()
            }
        }

        if (node.nodeName === 'fragment')
            (node as ForsteriNode__EnsureDiff).childNodes.forEach(
                (child, index) => {
                    applyDiff(
                        child,
                        element.childNodes[index] as ForsteriElement
                    )
                }
            )
        else applyDiff(node, element.childNodes[0] as ForsteriElement)
    },
    registerComponent = <
        StateType extends object,
        PropsType extends readonly string[]
    >({
        component,
        view,
        state,
        props,
        onCreated = () => () => {}
    }: {
        component: string
        view: ForsteriComponent<StateType, PropsType>
        state?: StateType
        props?: PropsType
        onCreated?: (state: State<StateType>) => (() => any) | void
    }) => {
        if (!customElements.get(component))
            customElements.define(
                component,
                class Forsteri extends HTMLElement {
                    element: ShadowRoot | this
                    state: StateType
                    props: any
                    observer: MutationObserver
                    lifecycle: any

                    constructor() {
                        super()

                        this.state = Object.assign({}, state)
                        this.props = {}
                        this.lifecycle = () => null
                        props?.forEach((prop) => (this.props[prop] = ''))

                        this.element = this.attachShadow({
                            mode: 'closed'
                        })

                        render(
                            view(
                                composeState(
                                    this.state,
                                    this.props,
                                    view,
                                    this.element
                                ),
                                this.props
                            ),
                            this.element
                        )

                        /* Defer until styling loaded */
                        requestAnimationFrame(() => {
                            if (this.element.querySelectorAll('link').length)
                                this.style.visibility = 'hidden'
                        })
                        let link: 0[] = []
                        this.element.querySelectorAll('link').forEach((css) => {
                            link.push(0)
                            css.addEventListener('load', () => {
                                link.pop()
                                if (!link.length)
                                    requestAnimationFrame(() => {
                                        this.style.visibility = ''
                                    })
                            })
                        })

                        this.observer = new MutationObserver((mutationsList) =>
                            mutationsList.forEach(() =>
                                requestAnimationFrame(() =>
                                    reflectChildren(
                                        this.element,
                                        this.childNodes
                                    )
                                )
                            )
                        )

                        this.observer.observe(this, {
                            childList: true,
                            subtree: true,
                            characterData: true
                        })
                    }

                    static get observedAttributes() {
                        return typeof props !== 'undefined' ? props : []
                    }

                    attributeChangedCallback(
                        name: string,
                        _: string,
                        prop: string
                    ) {
                        this.props[name] = prop

                        requestAnimationFrame(() => {
                            render(
                                view(
                                    composeState(
                                        this.state,
                                        this.props,
                                        view,
                                        this.element
                                    ),
                                    this.props
                                ),
                                this.element
                            )

                            reflectChildren(this.element, this.childNodes)
                        })
                    }

                    connectedCallback() {
                        this.lifecycle = onCreated(
                            composeState(
                                this.state,
                                this.props,
                                view,
                                this.element,
                                1
                            )
                        )
                    }

                    disconnectedCallback() {
                        this.observer.disconnect()
                        this.lifecycle()
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
        view: ForsteriComponent<StateType, PropsType>,
        element: ShadowRoot | ForsteriElement__EnsureElement,
        initial = 0
    ): State<StateType> => {
        let _state: any = Object.assign({}, state),
            _props = Object.assign({}, props),
            _render = (_state: StateType, initial = 0) => {
                requestAnimationFrame(() => {
                    render(
                        view(
                            composeState(
                                _state,
                                _props,
                                view,
                                element,
                                initial === 1 ? 2 : initial
                            ),
                            _props as any
                        ),
                        element as ForsteriElement__EnsureElement | ShadowRoot
                    )
                    reflectChildren(
                        element,
                        (element.getRootNode() as ShadowRoot).host.childNodes
                    )
                })
                return _state
            },
            _listener: Array<{
                listener: Array<keyof StateType> | true
                callback: Function
            }> = []

        return {
            state: _state,
            set: <T extends keyof StateType>(
                property: keyof StateType,
                value: StateType[T]
            ): StateType[T] => {
                _state[property] = value

                requestAnimationFrame(() => {
                    _render(_state)
                })

                _listener.forEach(({ listener, callback }) => {
                    if (listener === true || listener.includes(property))
                        callback(_state)
                })

                return _state
            },
            update: <T extends keyof StateType>(
                property: keyof StateType,
                value: Partial<StateType[T]> & Object
            ): StateType[T] => {
                _state[property] = Object.assign(_state[property], value)

                _render(_state, initial)

                _listener.forEach(({ listener, callback }) => {
                    if (
                        listener === true ||
                        listener.includes(property) ||
                        initial === 2
                    )
                        callback(_state)
                })

                return _state
            },
            on: (
                property: true | Array<keyof StateType>,
                callback: Function
            ) => {
                _listener.push({
                    listener: property,
                    callback
                })

                if (initial === 2) callback()
            }
        }
    },
    reflectChildren = (
        element: ShadowRoot | any,
        childNodes: NodeListOf<ChildNode>
    ) => {
        element
            .querySelectorAll('children')
            .forEach((_element: ForsteriElement__EnsureElement) => {
                let fragment = document.createDocumentFragment()

                childNodes.forEach((child) => {
                    fragment.appendChild(child.cloneNode(true))
                })

                if (_element.parentElement !== null)
                    _element.parentElement.replaceChild(fragment, _element)
                else _element.getRootNode().replaceChild(fragment, _element)
            })
    }

export {
    h,
    registerComponent,
    ForsteriComponent,
    diff,
    compareAttributes,
    create
}

export default {
    h,
    registerComponent
}
