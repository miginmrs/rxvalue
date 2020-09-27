import { combineLatest, of as rxof, Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged as rxdistinct, map as rxmap, multicast, refCount } from 'rxjs/operators';
export const of = (value) => Object.assign(rxof(value), { value });
export function map(p, thisArg, valued) {
    const map = rxmap(p, thisArg);
    return valued ? (source) => {
        const obs = map(source);
        return Object.defineProperty(obs, 'value', { get: () => p.call(thisArg, source.value, -1) });
    } : map;
}
export function distinctUntilChanged(compare, keySelector, valued) {
    const op = compare && keySelector ? rxdistinct(compare, keySelector) : rxdistinct(compare);
    return valued ? (source) => {
        const obs = source.pipe(op);
        return Object.defineProperty(obs, 'value', { get: () => source.value });
    } : op;
}
export const combine = (sources) => Object.defineProperty(combineLatest(sources), 'value', { get: () => sources.map(s => s.value) });
export const idem = (op) => (o) => Object.defineProperty(o.pipe(op), 'value', { get: () => o.value });
export const startWith = (source, value) => {
    const bs = new BehaviorSubject(value);
    return Object.defineProperty(source.pipe(multicast(bs), refCount()), 'value', { get: () => bs.value });
};
export const fromPromise = (p, value) => {
    const observable = new Observable(subs => {
        let done = false;
        subs.next(value);
        p.then(v => {
            if (!done)
                subs.next(value = v);
            subs.complete();
        }, err => subs.error(err));
        return () => { done = true; };
    });
    return Object.defineProperty(observable, 'value', () => value);
};
//# sourceMappingURL=rxvalue.js.map