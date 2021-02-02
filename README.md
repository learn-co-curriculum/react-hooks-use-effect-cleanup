# The useEffect Hook - Cleaning Up

## Overview

In the last lesson, we saw how to run functions as **side effects** of rendering
our components by using the `useEffect` hook. Here, we'll discuss best practices
when it comes to cleaning up after those functions so we don't have unnecessary
code running in the background when we no longer need it.

## Objectives

1. Return a cleanup function from our callback in the `useEffect` hook

## useEffect Cleanup

When using the `useEffect` hook in a component, you might end up with some
long-running code that you no longer need once the component is removed from
the page. Here's an example of a component that runs a timer in the background
continuously:

```js
function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <div>{time.toString()}</div>;
}
```

When the component first renders, the `useEffect` hook will run and create an
interval. That interval will run every 1 second in the background, and set the
time.

We could use this Clock component like so:

```js
function App() {
  const [showClock, setShowClock] = useState(true);

  return (
    <div>
      {showClock ? <Clock /> : null}
      <button onClick={() => setShowClock(!showClock)}>Toggle Clock</button>
    </div>
  );
}
```

When the button is clicked, we want to remove the clock from the DOM. That
_also_ means we should stop the `setInterval` from running in the background. We
need some way of cleaning up our side effect when the component is no longer
needed!

To demonstrate the issue, try clicking the "Toggle Clock" button &mdash;
you'll likely see a warning message like this:

```txt
index.js:1 Warning: Can't perform a React state update on an unmounted
component. This is a no-op, but it indicates a memory leak in your application.
To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup
function.
```

The reason for this message is that even after removing our `Clock` component
from the DOM, the `setInterval` function we called in `useEffect` is **still
running in the background**, and updating state every second.

React's solution is to have our `useEffect` function **return a cleanup
function**, which will run after the component "un-mounts": when it is removed
from the DOM after its parent component no longer returns it. Here's how the
cleanup function would look:

```js
function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // returning a cleanup function
    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  return <div>{time.toString()}</div>;
}
```

If you run this app again in the browser, and click the "Toggle Clock" button,
you'll notice we no longer get that error message. That's because we have
successfully cleaned up after our interval is no longer needed by running
`clearInterval`.

## Conclusion

Cleanup functions like this are useful if you have a long-running function that
you want to unsubscribe from when the component is no longer on the page. Common
examples include:

- a timer running via `setInterval`
- a subscription to a web socket connection

You don't always have to use a cleanup function as part of your `useEffect`
code, but it's good to know what scenarios make this functionality useful.

## Resources

- [React Docs on useEffect][use-effect-hook]
- [A Complete Guide to useEffect](https://overreacted.io/a-complete-guide-to-useeffect/)

[side-effects]: https://en.wikipedia.org/wiki/Side_effect_(computer_science)#:~:text=In%20computer%20science%2C%20an%20operation,the%20invoker%20of%20the%20operation.
[use-effect-hook]: https://reactjs.org/docs/hooks-effect.html
