export type StringIndexed = Record<string, any>;


export type OpCb<T = any, V = any> = (value: V, key: string, path: string[], target: T, isObject: boolean) => any;
export type OpArgs<T, V> = [T, OpCb<T, V>, boolean, string[]?];
export function _deepObjectOperation<T = StringIndexed, V = any>(...args: OpArgs<T, V>): void {
	const [target, callback, depthFirst, pathSoFar = []] = args;
	const entries = Object.entries(target);
	const trvD = () => entries.forEach(([key, value]) => _isObject(value) && _deepObjectOperation(value, callback, depthFirst, [...pathSoFar, key]));
	const trvB = () => entries.forEach(([key, value]) => callback(value, key, [...pathSoFar, key], target, _isObject(value)));
	if (depthFirst) {
		trvD();
		trvB();
	} else {
		trvB();
		trvD();
	}
}

export function _isObject(value: any): boolean {
	return (
		value !== null && typeof value === 'object' && value.constructor === Object
	);
}

export function _deepObjectTraverse<F extends boolean = true>(target: StringIndexed, [...path]: string[], create: F | true = true): StringIndexed {
	let step: string | undefined;
	while (step = path.shift()) {
		if (!_isObject(target[step])) {
			if (create) {
				target[step] = {};
			} else {
				throw new TypeError('Cannot traverse object, provided path does not exist')
			}
		}
		target = target[step];
	}
	return target;
}