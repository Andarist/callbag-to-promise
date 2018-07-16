import last from 'callbag-last'
import subscribe from 'callbag-subscribe'

export default function toPromise(source) {
  return new Promise((resolve, reject) => {
    subscribe({
      next: resolve,
      error: reject,
      complete: () => {
        reject(new Error('no elements in sequence'))
      },
    })(last()(source))
  })
}
