# Rxjs

## 理解 

可以看做异步流和同步流的数据处理的工具，通过观察者模式，发布订阅模式来观察数据流的变化。并有链式调用、封装的api、事件api、节流等。

在angular、next等框架都有集成，优秀的数据流的管理能力让你在复杂业务场景下能更好的维护并管理

## 观察者模式 与 发布订阅

观察者类似监听一个父类，父类维护订阅的方法，发布的方法。一旦发布，那么子类就要接受

发布订阅类似 on 注册，然后一个队列存储，一旦emit那么订阅触发执行完队列


## Observable 被观察者

类似定义数据的合集，他是生成数据并受Observer所监视。

```js
import { Observable } from 'rxjs';
 
const observable = new Observable((subscriber) => {
  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  setTimeout(() => {
    subscriber.next(4);
    subscriber.complete();
  }, 1000);
});
 
console.log('just before subscribe');
observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
console.log('just after subscribe');


 /** just before subscribe
got value 1
got value 2
got value 3
just after subscribe
got value 4
done  **/
```

## Observer 观察者

观察者需要传入subscribe中，使其可以订阅观察， 在next、error、complete回调中获取变化的数据流

```js
const observer = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
observable.subscribe(observer);
```

## Operators 运算符

通过pipe的一个纯函数，输入并输出不改变原数据格式的操作。运算符包含创建、筛选、错误、条件、数学、自定义等

常用： fromEvent from range  of  map filter  interval debounce throttle

```js
import { of, map } from 'rxjs';

of(1, 2, 3)
  .pipe(map((x) => x * x))
  .subscribe((v) => console.log(`value: ${v}`));
```

## Subscription 订阅

用于表示订阅的操作对象，主要用于取消订阅一个或多个观察的作用
```js
import { interval } from 'rxjs';
 
const observable1 = interval(400);
const observable2 = interval(300);
 
const subscription = observable1.subscribe(x => console.log('first: ' + x));
const childSubscription = observable2.subscribe(x => console.log('second: ' + x));
 
subscription.add(childSubscription);
 
setTimeout(() => {
  // Unsubscribes BOTH subscription and childSubscription
  subscription.unsubscribe();
}, 1000);
```

## Subjects 主体

Rxjs一种特殊类型的可观察量，它允许将值多播到许多观察者。虽然普通可观察量是单播的（每个订阅的观察者都拥有可观察量的独立执行），但主体是多播的。

```js
import { Subject } from 'rxjs';
 
const subject = new Subject<number>();
 
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`),
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`),
});
 
subject.next(1);
subject.next(2);
 
// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
```

主要应用有： 

1. 引用计数: 通过refCount来计算订阅次数 
2. 行为主体: BehaviorSubject可以直接传入默认值来初次被订阅
3. 重播主体: ReplaySubject 用于回退数据流并继续流动
4. 异步主体:  AsyncSubject  类似vue的$nextTick,多次数据流变化等到complete返回
5. 无效主体: 表示在注重事件的情况下，没有必要传入类型，只需要void

## Scheduler 调度

1. 用于安排异步调度顺序
2. 执行上下文，可以控制任务执行的位置和时间

```js
import { Observable, observeOn, asyncScheduler } from 'rxjs';
 
const observable = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.next(3);
  observer.complete();
}).pipe(
  observeOn(asyncScheduler)
);
 
console.log('just before subscribe');
observable.subscribe({
  next(x) {
    console.log('got value ' + x);
  },
  error(err) {
    console.error('something wrong occurred: ' + err);
  },
  complete() {
    console.log('done');
  },
});
console.log('just after subscribe');

/**
 * just before subscribe
just after subscribe
got value 1
got value 2
got value 3
done
 */

```

