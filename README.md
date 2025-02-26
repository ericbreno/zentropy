# Zentropy
#### Zen (simplicity) + Entropy (state change)

A lightweight and flexible state management library for TS and JS projects. This library provides a simple way to share and manage state across your application with reducers, subscriptions, actions, middleware, and a reset function.

## Why Use This Library?

Unlike verbose state management solutions like Redux, this library is:

- ✅ **Lightweight** – No unnecessary boilerplate. No dependencies.
- ✅ **Easy to use** – Simple API with minimal setup.
- ✅ **Flexible** – Works with reducers, direct updates, and middleware.
- ✅ **Performant** – Uses direct state updates and subscriptions for efficiency.

## Installation

You can install the package via npm:

```sh
npm install zentropy
```

or using yarn:

```sh
yarn add zentropy
```

## Usage

### Creating a State

```typescript
import { makeState } from "zentropy";

const initial: number = 0;

// Type are inferred from initial and reducer's keys
const counterState = makeState({
  initial,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
    add: (state, amount) => state + amount
  },
});
```

### Subscribing to State Changes

```typescript
counterState.subscribe((value) => {
  console.log("Counter updated:", value);
});
```

### Updating State Directly

```typescript
counterState.update(10);
```

### Using Auto-Generated Actions

```typescript
const { increment, decrement } = counterState.actions;

increment();
decrement();
counterState.actions.add(5);
```

### Dispatching Actions

```typescript
counterState.dispatch("increment");
counterState.dispatch("decrement");
counterState.dispatch("add", 10);
```

### Resetting State

Reset the state to its initial value:

```typescript
counterState.reset();
```

### Using Middleware

Middleware functions allow you to intercept state updates, useful for logging, debugging, or persisting state.

```typescript
counterState.use((state, action, payload) => {
  console.log(`Action: ${action}, Payload:`, payload, "New State:", state);
});

counterState.dispatch("increment");
// Console: Action: increment, Payload: undefined, New State: 1
```

## API

### `makeState(props: MakeProps)`
Creates a new state instance.

### `state.value`
Returns the current state value.

### `state.subscribe(fn: (value: T) => void)`
Subscribes a listener to state changes.

### `state.unsubscribe(fn: (value: T) => void)`
Unsubscribes a listener.

### `state.update(updated: T)`
Directly updates the state value and notifies subscribers.

### `state.actions`
Provides an object containing callable actions based on the defined reducers.

### `state.dispatch(action: ReducerKey, payload?: any)`
Calls a reducer function with the given action and payload.

### `state.reset()`
Resets the state to its initial value.

### `state.use(middleware: Middleware<T>)`
Adds middleware to intercept and process state changes.

## License
MIT

