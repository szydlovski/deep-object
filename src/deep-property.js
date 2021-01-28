import { _deepObjectTraverse } from './core.js';

function validatePath(path) {
	if (typeof path === 'string') {
		return path.split('.');
	} else if (Array.isArray(path)) {
		return [...path];
	} else {
		throw new TypeError(`${path} is not a string or an array`);
	}
}

function extractDeepProperty(target, path) {
	path = validatePath(path);
	const key = path.pop();
	const position = _deepObjectTraverse(target, path, false);
	if (position === undefined) {
		return [false, undefined];
	}
	const exists = Object.keys(position).includes(key);
	const value = position[key];
	return [exists, value];
}

function hasDeepProperty(target, path) {
	return extractDeepProperty(target, path)[0];
}

function getDeepProperty(target, path) {
	return extractDeepProperty(target, path)[1];
}

function setDeepProperty(target, path, value) {
	path = validatePath(path);
	const key = path.pop();
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
