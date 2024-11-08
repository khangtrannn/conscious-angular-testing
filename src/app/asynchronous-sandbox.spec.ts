import { fakeAsync, flush, flushMicrotasks, tick, waitForAsync } from "@angular/core/testing";
import { delay, of } from "rxjs";

/**
 * Another thing to keep in mind is that when we call `tick()`, it first calls the `flushMicrotasks()` function, as `microtasks` should run before `macrotasks`.
 */

describe('Asynchronous sandbox', () => {
  it('should wait for this promise to finish (done)', (done) => {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => resolve(`I'm the promise result`), 1000);
    });

    p.then((result) => {
      console.log(result); // "I'm the promise result" after 1s
      done(); // wait for the `done` is invoked before it moves on the next test or assertion
    });
  });

  it('should wait for this promise to finish (waitForAsync)', waitForAsync(() => {
    const p = new Promise((resolve, reject) =>
      setTimeout(() => resolve(`I'm the promise result`), 1000)
    );

    p.then((result) => {
      console.log(result);
    });

    // notice that we didn't call `done` here thanks to async
    // which created a special zone from zone.js
    // this test is now aware of pending async operation and will wait
    // for it before passing to the next one
  }));

  it('should await for this promise to finish (fakeAsync)', fakeAsync(() => {
    const p = new Promise((resolve) => {
      setTimeout(() => {
        resolve(`I'm the promise result`);
      }, 10000);
    });

    // simulates time moving forward and executing async tasks
    flush();

    p.then(result => {
      // following will display "I'm the promise result" **instantly**
      console.log(result);
    });

    // notice that we didn't call `done` here has there's no async task pending
  }));

  it('should wait for this promise to finish (async/await)', async () => {
    const p = new Promise((resolve) => setTimeout(() => resolve('result'), 1000));
    const result = await p;
    expect(result).toBe('result');
  });

  it('check how flushMicrotasks works', fakeAsync(() => {
    let flag = false;

    Promise.resolve(true).then((result) => {
      flag = result;
    });

    expect(flag).toBe(false);
    flushMicrotasks(); // flush any pending microtasks
    expect(flag).toBe(true);
  }));

  it('async test example - rxjs observables', fakeAsync(() => {
    let test = false;
    console.log('creating observable');
    const test$ = of(test);

    test$.pipe(delay(1000)).subscribe(() => {
      test = true;
    });

    tick(1000);

    expect(test).toBeTruthy();
  }));
});
