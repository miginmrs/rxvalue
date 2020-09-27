import { combineLatest, of as rxof, Observable, OperatorFunction, ObservedValueOf, UnaryFunction, Subscriber } from 'rxjs';
import { distinctUntilChanged as rxdistinct, map as rxmap } from 'rxjs/operators';

export type ValuedSubject<T, V extends T = T> = ValuedObservable<T> & { next: (value: V) => void; };
export type ValuedObservable<T> = Observable<T> & { readonly value: T; };
export type ValuedOperatorFunction<T, R> = UnaryFunction<ValuedObservable<T>, ValuedObservable<R>>;
export type VOperatorFunction<T, R> = OperatorFunction<T, R> | ValuedOperatorFunction<T, R>;

export const of = <T>(value: T) => Object.assign(rxof(value), { value });

export function map<T, R, V>(project: (this: V, value: T, index: number) => R, thisArg: V): OperatorFunction<T, R>;
export function map<T, R>(project: (this: Subscriber<T>, value: T, index: number) => R): OperatorFunction<T, R>;
export function map<T, R, V>(project: (this: Subscriber<T> | V | undefined, value: T, index: number) => R, thisArg: V, valued: true): ValuedOperatorFunction<T, R>;
export function map<T, R>(project: (this: Subscriber<T>, value: T, index: number) => R, thisArg: undefined, valued: true): ValuedOperatorFunction<T, R>;
export function map<T, R, V>(p: (this: Subscriber<T> | V | undefined, value: T, index: number) => R, thisArg?: V, valued?: true): VOperatorFunction<T, R> {
  const map = rxmap(p, thisArg);
  return valued ? (source: ValuedObservable<T>) => {
    const obs = map(source);
    return Object.defineProperty(obs, 'value', { get: () => p.call(thisArg, source.value, -1) })
  } : map;
}

type Compare<T> = (a: T, b: T) => boolean;
export function distinctUntilChanged<T>(compare?: Compare<T>): OperatorFunction<T, T>;
export function distinctUntilChanged<T>(compare: Compare<T> | undefined, keySelector: undefined, valued: true): ValuedOperatorFunction<T, T>;
export function distinctUntilChanged<T, K>(compare: Compare<K>, keySelector: (x: T) => K): OperatorFunction<T, T>;
export function distinctUntilChanged<T, K>(compare: Compare<K>, keySelector: (x: T) => K, valued: true): ValuedOperatorFunction<T, T>;
export function distinctUntilChanged<T, K>(compare?: Compare<K>, keySelector?: (x: T) => K, valued?: true): VOperatorFunction<T, T> {
  const op = compare && keySelector ? rxdistinct<T, K>(compare, keySelector) : rxdistinct<T>(compare as unknown as Compare<T>);
  return valued ? (source: ValuedObservable<T>) => {
    const obs = source.pipe(op);
    return Object.defineProperty(obs, 'value', { get: () => source.value });
  } : op;
}

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

