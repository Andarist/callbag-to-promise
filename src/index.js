import last from 'callbag-last-element'
import subscribe from 'callbag-subscribe'

export default function toPromise(source) {
  return new Promise((resolve, reject) => {
    subscribe({
      next: resolve,
      error: reject,
      complete: () => {
        const err = new Error('No elements in sequence.')
        err.code = 'NO_ELEMENTS'
        reject(err)
      },
    })(last(source))
  })
}
