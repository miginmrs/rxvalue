import { combineLatest, of as rxof, Observable, OperatorFunction, ObservedValueOf, UnaryFunction } from 'rxjs';
import { distinctUntilChanged, map as rxmap } from 'rxjs/operators';

export type ValuedSubject<T, V extends T = T> = ValuedObservable<T> & { next: (value: V) => void; };
export type ValuedObservable<T> = Observable<T> & { readonly value: T; };

export const of = <T>(value: T) => Object.assign(rxof(value), { value });

export const map = <T, R>(o: ValuedObservable<T>, p: (v: T) => R): ValuedObservable<R> => Object.defineProperty(
  o.pipe(rxmap(p)), 'value', { get: () => p(o.value) }
);

export const distinct = <T>(o: ValuedObservable<T>, eq?: (a: T, b: T) => boolean): ValuedObservable<T> => Object.defineProperty(
  o.pipe(distinctUntilChanged(eq)), 'value', { get: () => o.value }
);

export const combine = <O extends ValuedObservable<any>>(sources: O[]): ValuedObservable<ObservedValueOf<O>[]> => Object.defineProperty(
  combineLatest(sources), 'value', { get: () => sources.map(s => s.value) }
);

export const idem = <T>(op: OperatorFunction<T, T>): ValuedOperatorFunction<T, T> => (o: ValuedObservable<T>) => Object.defineProperty(
  o.pipe(op), 'value', { get: () => o.value }
);

export const fromPromise = <T>(p: PromiseLike<T>, value: T) => {
  const observable = new Observable<T>(subs => {
    let done = false;
    subs.next(value);
    p.then(v => {
      if (!done) subs.next(value = v);
      subs.complete();
    }, err => subs.error(err));
    return () => { done = true; };
  });
  return Object.defineProperty(observable, 'value', () => value);
};

declare module 'rxjs' {
  interface Observable<T> {
    pipe(this: ValuedObservable<T>): ValuedObservable<T>;
    pipe<A>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>): ValuedObservable<A>;
    pipe<A, B>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>): ValuedObservable<B>;
    pipe<A, B, C>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>): ValuedObservable<C>;
    pipe<A, B, C, D>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>): ValuedObservable<D>;
    pipe<A, B, C, D, E>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>): ValuedObservable<E>;
    pipe<A, B, C, D, E, F>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>): ValuedObservable<F>;
    pipe<A, B, C, D, E, F, G>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>): ValuedObservable<G>;
    pipe<A, B, C, D, E, F, G, H>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>, op8: ValuedOperatorFunction<G, H>): ValuedObservable<H>;
    pipe<A, B, C, D, E, F, G, H, I>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>, op8: ValuedOperatorFunction<G, H>, op9: ValuedOperatorFunction<H, I>): ValuedObservable<I>;
    pipe<A, B, C, D, E, F, G, H, I>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>, op8: ValuedOperatorFunction<G, H>, op9: ValuedOperatorFunction<H, I>, ...operations: ValuedOperatorFunction<any, any>[]): ValuedObservable<{}>;
  }
}
export interface ValuedOperatorFunction<T, R> extends
  UnaryFunction<ValuedObservable<T>, ValuedObservable<R>>, OperatorFunction<T, R> { }

