"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromise = exports.startWith = exports.idem = exports.combine = exports.distinctUntilChanged = exports.map = exports.of = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
exports.of = (value) => Object.assign(rxjs_1.of(value), { value });
function map(p, thisArg, valued) {
    const map = operators_1.map(p, thisArg);
    return valued ? (source) => {
        const obs = map(source);
        return Object.defineProperty(obs, 'value', { get: () => p.call(thisArg, source.value, -1) });
    } : map;
}
exports.map = map;
function distinctUntilChanged(compare, keySelector, valued) {
    const op = compare && keySelector ? operators_1.distinctUntilChanged(compare, keySelector) : operators_1.distinctUntilChanged(compare);
    return valued ? (source) => {
        const obs = source.pipe(op);
        return Object.defineProperty(obs, 'value', { get: () => source.value });
    } : op;
}
exports.distinctUntilChanged = distinctUntilChanged;
exports.combine = (sources) => Object.defineProperty(rxjs_1.combineLatest(sources), 'value', { get: () => sources.map(s => s.value) });
exports.idem = (op) => (o) => Object.defineProperty(o.pipe(op), 'value', { get: () => o.value });
exports.startWith = (source, value) => {
    const bs = new rxjs_1.BehaviorSubject(value);
    return Object.defineProperty(source.pipe(operators_1.multicast(bs), operators_1.refCount()), 'value', { get: () => bs.value });
};
exports.fromPromise = (p, value) => {
    const observable = new rxjs_1.Observable(subs => {
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