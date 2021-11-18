import { _deepObjectTraverse } from './core.js';

function validatePath(path: KeyPath): string[] {
	if (typeof path === 'string') {
		return path.split('.');
	} else if (Array.isArray(path)) {
		return [...path];
	} else {
		throw new TypeError(`Path is not a string or an array`);
	}
}

export type KeyPath = string | string[];

function extractDeepProperty<T = any>(target: object, keyPath: KeyPath): [true, T] | [false, undefined] {
	const path = validatePath(keyPath);
	const key = path.pop();
	if (!key) throw new TypeError('Cannot extract deep property from an empty path');
	try {
		const position = _deepObjectTraverse(target, path, false);
		const exists = Object.keys(position).includes(key);
		const value = position[key];
		return [exists, value];
	} catch {
		return [false, undefined];
	}

}

function hasDeepProperty(target: object, keyPath: KeyPath): boolean {
	return extractDeepProperty(target, keyPath)[0];
}

function getDeepProperty<T = any>(target: object, keyPath: KeyPath): T | undefined {
	return extractDeepProperty(target, keyPath)[1];
}

function setDeepProperty(target: object, keyPath: KeyPath, value: any): object {
	const path = validatePath(keyPath);
	const key = path.pop();
	if (!key) throw new TypeError('Cannot set deep property on an empty path');
	const position = _deepObjectTraverse(target, path);
	position[key] = value;
	return target;
}

export {
	extractDeepProperty,
	hasDeepProperty,
	getDeepProperty,
	setDeepProperty,
	extractDeepProperty as extractProperty,
	hasDeepProperty as hasProperty,
	getDeepProperty as getProperty,
	setDeepProperty as setProperty,
};
