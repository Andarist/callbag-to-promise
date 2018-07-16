# callbag-to-promise

Callbag operator which converts source to a promise containing last emitted value.

## Example

```js
import interval from 'callbag-interval'
import pipe from 'callbag-pipe'
import takeUntil from 'callbag-take-until'
import toPromise from 'callbag-to-promise'

pipe(
  interval(30),
  takeUntil(interval(200)),
  toPromise,
).then(value => {
  console.log(value) // 5
})
```
