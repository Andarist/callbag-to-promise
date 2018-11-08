import fromIter from 'callbag-from-iter'
import pipe from 'callbag-pipe'
import subject from 'callbag-subject'

import toPromise from '../src'

test('works with listenables', () => {
  const tapped = []
  const source = subject()

  const promise = pipe(
    source,
    toPromise,
  ).then(value => {
    tapped.push(value)
    return value
  })

  return Promise.resolve()
    .then(() => {
      expect(tapped.length).toBe(0)
    })
    .then(() => {
      source(1, 10)
      source(1, 20)
      expect(tapped.length).toBe(0)
    })
    .then(() => {
      expect(tapped.length).toBe(0)
      source(1, 30)
    })
    .then(() => {
      expect(tapped.length).toBe(0)
      source(2)
      // resolve is async
      expect(tapped.length).toBe(0)
      return promise
    })
    .then(value => {
      expect(value).toEqual(30)
    })
})

test('works with pullables', () => {
  return pipe(
    fromIter([10, 20, 30, 40, 50]),
    toPromise,
  ).then(value => {
    expect(value).toEqual(50)
  })
})

test('rejects on errors', () => {
  const source = subject()

  const promise = pipe(
    source,
    toPromise,
  )

  return Promise.resolve()
    .then(() => {
      source(1, 10)
      source(1, 20)
    })
    .then(() => {
      source(1, 30)
    })
    .then(() => {
      source(2, new Error('test err'))
      return promise
    })
    .catch(err => {
      expect(err.message).toBe('test err')
    })
})

test('rejects on completed empty streams', () => {
  const source = subject()

  const promise = pipe(
    source,
    toPromise,
  )

  return Promise.resolve()
    .then(() => {
      source(2)
      return promise
    })
    .catch(err => {
      expect(err.message).toBe('No elements in sequence.')
      expect(err.code).toBe('NO_ELEMENTS')
    })
})
