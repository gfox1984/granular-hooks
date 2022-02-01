# granular-hooks

The [React hooks](https://reactjs.org/docs/hooks-intro.html) you know, with added granularity.

## The problem

Who hasn't been in the situation where s/he needs an effect to run
only when _some_ of its dependencies have changed? Take this code for instance:

```typescript
import { useEffect } from "react";

useEffect(() => {
  if (condition) console.log("condition is true! value is", value);
  else console.log("condition is false! value is", value);
}, [value, condition]);
```

Here, the effect prints to the console each time `value` or `condition` change. You cannot print to the console ONLY when `value` changes because `useEffect` requires that [all values used by the effect are passed in the array of dependencies](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect).

## The solution

With minimal effort, `useGranularEffect` allows you to splits your array of dependencies into two: primary dependencies and secondaries dependencies.

`useGranularEffect` guarantees that:

- the effect only runs when the primary dependencies change
- the cleanup function (if any) only runs when the primary dependencies change
- when the effect runs, both primary and secondary dependencies are up-to-date

The example above can now be changed to:

```typescript
import { useGranularEffect } from "granular-hooks";

useGranularEffect(
  () => {
    if (condition) console.log("condition is true! value is", value);
    else console.log("condition is false! value is", value);
  },
  [value],
  [condition]
);
```

Now the code only prints to the console when `value` changes.

## Installation

```
npm install granular-hooks
```

or

```
yarn add granular-hooks
```

## Usage

```typescript
import { useGranularEffect } from "granular-hooks";

useGranularEffect(
  () => {
    // the effect function, use your dependencies here
    // dep1, dep2, dep3, dep4,...

    // (optional) return a cleanup function
    return () => {
      /* cleanup*/
    };
  },
  [dep1, dep2], // primary dependencies (runs when they change)
  [dep3, dep4] // secondary dependencies (does not run when they change)
);
```

The only difference with `useEffect` is that the array of dependencies is split into two (the primary dependencies and the secondary dependencies). In fact, `useGranularEffect` uses `useEffect` under the hood, thus the similarities.

See the [React documentation for `useEffect`](https://reactjs.org/docs/hooks-reference.html#useeffect) for more information regarding the effect function, the optional cleanup function and dependencies.

Also check the general [rules of hooks](https://reactjs.org/docs/hooks-rules.html).

## What's next?

Below are the features we're working on:

- [ ] Why stop with granular effect? granular memos and callback are calling too! Stay tuned.
- [ ] React hooks have a great [ESLint plugin](https://reactjs.org/docs/hooks-rules.html#eslint-plugin) that makes sure you don't forget to list dependencies when calling them. `granular-hooks` are still missing such tools.

## FAQ

### Can I leave either the array of primary or secondary dependencies empty?

You could but that would defeat the purpose of the hook. You might as well call `useEffect` directly.

### Why use `useGranularEffect` when I can just omit some dependencies in `useEffect`?

While you could technically do so, it would violate the rules exposed in [conditionally firing an effect](https://reactjs.org/docs/hooks-reference.html#conditionally-firing-an-effect):

> make sure the array includes all values from the component scope (such as props and state) that change over time and that are used by the effect. Otherwise, your code will reference stale values from previous renders.
