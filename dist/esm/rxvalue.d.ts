import { Observable, OperatorFunction, ObservedValueOf, UnaryFunction, Subscriber } from 'rxjs';
export declare type ValuedSubject<T, V extends T = T> = ValuedObservable<T> & {
    next: (value: V) => void;
};
export declare type ValuedObservable<T> = Observable<T> & {
    readonly value: T;
};
export declare type ValuedOperatorFunction<T, R> = UnaryFunction<ValuedObservable<T>, ValuedObservable<R>>;
export declare type VOperatorFunction<T, R> = OperatorFunction<T, R> | ValuedOperatorFunction<T, R>;
export declare const of: <T>(value: T) => Observable<T> & {
    value: T;
};
export declare function map<T, R, V>(project: (this: V, value: T, index: number) => R, thisArg: V): OperatorFunction<T, R>;
export declare function map<T, R>(project: (this: Subscriber<T>, value: T, index: number) => R): OperatorFunction<T, R>;
export declare function map<T, R, V>(project: (this: Subscriber<T> | V | undefined, value: T, index: number) => R, thisArg: V, valued: true): ValuedOperatorFunction<T, R>;
export declare function map<T, R>(project: (this: Subscriber<T>, value: T, index: number) => R, thisArg: undefined, valued: true): ValuedOperatorFunction<T, R>;
declare type Compare<T> = (a: T, b: T) => boolean;
export declare function distinctUntilChanged<T>(compare?: Compare<T>): OperatorFunction<T, T>;
export declare function distinctUntilChanged<T>(compare: Compare<T> | undefined, keySelector: undefined, valued: true): ValuedOperatorFunction<T, T>;
export declare function distinctUntilChanged<T, K>(compare: Compare<K>, keySelector: (x: T) => K): OperatorFunction<T, T>;
export declare function distinctUntilChanged<T, K>(compare: Compare<K>, keySelector: (x: T) => K, valued: true): ValuedOperatorFunction<T, T>;
export declare const combine: <O extends ValuedObservable<any>>(sources: O[]) => ValuedObservable<ObservedValueOf<O>[]>;
export declare const idem: <T>(op: OperatorFunction<T, T>) => ValuedOperatorFunction<T, T>;
export declare const startWith: <T>(source: Observable<T>, value: T) => ValuedObservable<T>;
export declare const fromPromise: <T>(p: PromiseLike<T>, value: T) => ValuedObservable<T>;
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
export {};
