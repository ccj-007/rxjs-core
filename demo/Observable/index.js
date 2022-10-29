
import { Observable } from "rxjs";

const ob = new Observable((subscriber) => {
  subscriber.next(1)
  subscriber.next(2)
  subscriber.next(3)
  setTimeout(() => {
    subscriber.next(4)
    subscriber.complete(3)
  }, 1000);
})

console.log('just before subscribe');
ob.subscribe({
  next (x) {
    console.log('got value ' + x);
  },
  error (err) {
    console.error('something wrong occurred: ' + err);
  },
  complete () {
    console.log('done');
  },
});
console.log('just after subscribe');