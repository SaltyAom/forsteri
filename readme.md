# Forsteri

Reusable reactive Web Component with Virtual DOM in 1KB (gzipped).

## Inspiration

Virtual DOM has been introduced to Web Development for many year. The key take away is to `update only neccessary` thus lead a great step forward in web development.

Each library has it's own ecosystem and trying to make itself reusable. But the one take away is, they could only reuse in it's own environment which means working across multiple library on large-scale project is lock down.
  
But how could we make a component to be reusable and still gaining benefit from Virtual DOM? So just create one, a simple and light-weight one which connect each component across many libraries.

## Reusable + Virtual DOM

Web Component, a native reusable component.  
Virtual DOM, more performant and easier way to control DOM.

What if, we could have a benefit of both world while still easy-to-use and light-weight on it's own.

That's why Forsteri is created. To create a reusable Web Component with Virtual DOM while it is still easy to create and use.

## Why?

Forsteri is a library which helps create high-performance web component.

Feature:

-   Reusable for every project.
-   Virtual DOM and JSX.
-   Simple way to create web component.
-   Reactive.
-   No class, just function.
-   Encapsulation, ensure how the component looks.
-   Expressive Vanilla like API structure.
-   Very fast and small. (1.7KB Gzipped)
-   First Class TypeScript support.
-   Zero Dependencies.

### And how does the syntax looks like?

It's just as simple as

```javascript
// Get utility
import { h, registerComponent } from 'forsteri'

// Define how component looks like
let view = () => <h1>Forsteri Element</h1>

// Create Component
registerComponent({
    component: 'my-element',
    view
})
```

And add `my-element` to HTML.

```javascript
<body>
    <my-element></my-element>
</body>
```

# Getting Started

Glad you're interested in Forsteri! Let's take a quick start with a starter template which has a perfect configured environment.

```bash
git clone https://github.com/SaltyAom/forsteri-typescript-starter
```

The starter template has a suitable environment to start trying a web component.

You can also see how [the starter template looks like on this demo.](https://forsteri-starter.netlify.com)

Including:

-   Configured JSX, using HTML syntax in JavaScript
-   Development environment and production built.
-   Minimal Starter suitable for higher integration.
-   TypeScript built-in.

## JSX and HyperScript

Let's start by exploring code structure, enviroment and how it work.

It's all start by defining a Function Component with determined how should it's looks like. If you're familiar with React, it's almost the same like how you define in React.

```javascript
// Get utility
import { h } from 'forsteri'

// Define how component looks like
let view = () => <h1>Forsteri Element</h1>
```

But how and why does HTML are in JavaScript!?

By writing a simple `<h1>Forsteri Element</h1>`, it was translated to:

```javascript
h('h1', null, 'Forsteri Element')
```

This is called JSX. Which introduced to React and widely used in React, Vue and others Virtual DOM library.

By defining a HTML structured like is far easier than how define view in JavaScript. A simple HTML contains a complex JavaScript structured

```javascript
<section id="card">
    <h1 class="title" style="font-size: 1.5em">
        Hello World
    </h1>
</section>
```

Which translated to

```javascript
h(
    'section',
    {
        id: 'card'
    },
    h(
        'h1',
        {
            class: 'title',
            style: {
                fontSize: '1.5em'
            }
        },
        'Hello World'
    )
)
```

An imported `h` is a shorten for `HyperScript` which inspired the way how Virtual DOM structured. We use defined an element in Virtual DOM, a function for element-creation is mandatory. That's why we included `h` for every component which has Virtual DOM defined.

Which means this work:

```javascript
import { h } from 'forsteri'

const Card = () => <h1>Hello World</h1>
```

But this doesn't work:

```javascript
const Card = () => <h1>Hello World</h1>
```

By default, Forsteri use `babel-plugin-react-jsx` and define pragma with `babel-plugin-jsx-pragmatic` to convert JSX to Forsteri's HyperScript. Which power JSX of Forsteri DOM creation.

## Function Component

Forsteri is inspired by React's Function Component. Defining a simple function which contains logical expression.

```javascript
const Card = <
	StateType extends Object,
    PropsType extends string[] as const
>(
	stateObject: State<StateType> {
      	state: StateType,
      	set: (
          	key: keyof StateType,
          	value: StateType[keyof StateType]
      	) => StateType
    },
	props: Record<PropsType[number], string>)
) => ForsteriVNode
```

Which can be typed like this in TypeScript:

```javascript
import { h, ForsteriComponent } from 'forsteri'

const state = { message: 'Hello World' },
    props = ['title'],
    View: ForsteriComponent<typeof state, typeof props> = (
        { state: { message }, set },
        { title }
    ) => {
        return <h1>Hello World</h1>
    }
```

We'll discussed about `state` and `props` later.

#### In basic way it's looks like

```javascript
const View = () => <h1>Hello World</h1>
```

You could write view like how you write in HTML. Forsteri use native attributes contrast to React. Which means you doesn't have to use `className` instead of `class`.

## Register Component

`registerComponent()` is a function which define how component should represented to browser. How should it's tag looks like, how should it render, what should it contains?

It receive these following parameter:

```javascript
registerComponent({
	component: string,         // Define component's name
    view: ForsteriComponent,   // Function component which we declared
    state?: State<StateType>,  // State
    props?: Props<PropsType>   // Props
})
```

In most basic way its important part is:

```javascript
const Card = () => <h1>Hello World</h1>

registerComponent({
    component: 'my-element',
    view: Card
})
```

## State

Like angular, react and vue, Vanilla Milk also has state.
State is a variable which responsible for storing data and display it to the view.

When it the state changed, the it suddenly reflect to the view, update only its part.

To define a state, we defining it in plain object with its initial value.

```javascript
let state = {
    message: 'Hello World'
}
```

And add it to `registerComponent`:

```javascript
registerComponent({
    component: 'my-element',
    view: Card
})
```

Then function component will receive the state with helpers as its first parameters.

```javascript
const Card = (state) => <h1>Hello World</h1>

// state
{
 	state: {
    	message: 'Hello World'
   	},
   	set: (stateName, newValue) => newValue
}
```

We destruct these state to 2 types: `state` and `set`.

-   `state` - contains object represent state.
-   `set` - function which receive state name and its new value.

#### Display to view

Then we display its value to the view by object destructing:

```javsacript
const Card = ({ state: {  message } }) => <h1>{message}</h1>
```

And then when we added `<my-element>` to HTML, it would display:

```javsacript
<h1>Hello World</h1>
```

#### Update state

In real-world, state change very often as its designed to be. State is a variable which change often.

Let's say we create a counter. Every time we click a button, a counter is increased, but how would we do it? We use `set()`, a helper function to update state.

First, let's define a view and state.

```javascript
import { h, registerComponent } from 'forsteri'

const state = {
        counter: 0
    },
    Counter = ({ state: { counter }, set }) => (
        <section>
            <h1>{counter}</h1>
            <button>Increase</button>
        </section>
    )

registerComponent({
    component: 'my-counter',
    view: Counter
})
```

Notice that we have `set` here, it is responsible to update state and reflect to view.

To update state, we simply need `state name` and it's `new value`:

```javascript
set('counter', counter + 1)
```

By default state is immutable object, we can't directly update it's value. Which we have `set()` to update its value.

Then we attach event and invoke `set()`.

```javascript
<section>
    <h1>{counter}</h1>
    <button onClick={() => set('counter', counter + 1)>Increase</button>
</section>
```

In result this is how we looks like:

```javascript
import { h, registerComponent } from 'forsteri'

const state = {
		counter: 0
	},
    Counter = ({
    	state: { counter },
        set
    }) => (
      	<section>
          	<h1>{counter}</h1>
          	<button
            	onClick={() => set('counter', counter + 1)
            >
            	Increase
            </button>
      	</section>
  	)

registerComponent({
	component: 'my-counter',
    view: Counter
})
```

#### In action

Now every time we click the button, it's `counter` would increase by one.

## Props

Contrast to state, it's super simple. props is shorten for properties. A property is like a HTML attribute. For a button like:

```javascript
<button class="nice-button">Hello! I'm a button</button>
```

Class is a props of this button and it's value is "nice-button".

Like state, and defined props and add to `registerComponent()` but in contrast, we only need to define it's name as a string of array.

```javascript
let props = ['class']

registerComponent({
    component: 'my-card',
    view: Card,
    props
})
```

Function Component get props as second parameter as an object:

```javascript
const Card = (_, props) => <section></section>
```

We can use object destructing to get it's value:

```javascript
const Card = (_, { class }) => (
	<section class={class}></section>
)
```

Its props would get when added to our Web Component:

```javascript
<my-card class="card"></my-card>

// Our component return: <section class="card"}></section>
```

## Conditional Rendering

We could determined and control how our view looks like based on `state` and `props`

Let's say on previous counter element, we would like to hide it's increase button.

We simply use if else to determined the view:

```javascript
import { h, registerComponent } from 'forsteri'

const state = {
        counter: 0
    },
    Counter = ({ state: { counter }, set }) => {
        if (counter >= 10)
            return (
                <section>
                    <h1>{counter}</h1>
                </section>
            )

        return (
            <section>
                <h1>{counter}</h1>
                <button onClick={() => set('counter', counter + 1)}>
                    Increase
                </button>
            </section>
        )
    }

registerComponent({
    component: 'my-counter',
    view: Counter
})
```

Or better, we could use ternary operator to determined inline JSX.

```javascript
import { h, registerComponent } from 'forsteri'

const state = {
		counter: 0
	},
    Counter = ({
    	state: { counter },
        set
    }) => (
      	<section>
          	<h1>{counter}</h1>
            { counter >= 10 ?
            	<fragment />
            :
                <button
                    onClick={() => set('counter', counter + 1)
                >
                  	Increase
              	</button>
        	}
      	</section>
  	)

registerComponent({
	component: 'my-counter',
    view: Counter
})
```

After counter is more or equal to 10, it's button should disappear.

You can also use `props` to determined how component looks like, but keep in mind that props isn't be able to change by itself. Only its parent should change it's props.

## Fragment

In JSX, we couldn't simply return multiple element in one root node due to an Virtual DOM algorithm. But as an alternate way, we have `fragment` which represent a blank node which contains multiple node.

This fragment doesn't render to the view but its children is render instead. Without any children, it's render nothing.

```javascript
// Render nothing
let View = () => <fragment />

// Normally we couldn't have multiple root node.
// With fragment, we could render multiple root node.
let Card = () (
	<fragment>
    	<div>Hello World</div>
        <button>Nice Button</button>
    </fragment>
)
```

## Children

Children is the most basic concept in HTML.

```javascript
<my-card>
	<h1>Hello World</h1>
</my-card>

let Card = () <children />
```

This will render `<my-card />` with `<h1>Hello World</h1>` inside.

## Encapsulation

Shadow DOM is used to encapsulate logic and style. Preventing an unexpected change while working in multiple library.

External stylesheet wouldn't affected content inside Shadow DOM which also applied to our web component.

```javascript
// style.css
h1 {
	color: red;
}

// index.html
<link rel='stylesheet' href='style.css'>
<my-card></my-card>

// card.tsx
let Card = () => <h1>Title</h1> // Doesn't affected by style.css
```

To use external stylesheet in Milk Component, you can assign stylesheet in the component instead.

```javascript
let Card = () => (
	<fragment>
		<link rel='stylesheet' href='style.css'>
	    <h1>Title</h1> // Affected by style.css
    </fragment>
)
```

To make sure our component keeps as same as should looks like. It only displayed when every stylesheet its required loaded.

That's pretty all important concept of Forsteri.
