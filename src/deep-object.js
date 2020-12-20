const {
	_deepObjectOperation,
	_isObject,
	_deepObjectTraverse,
} = require('./core.js');

function deepObjectMap(
	target,
	callback,
	includeIntermediate = false,
	depthFirst = false
) {
	const result = {};
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			const position = _deepObjectTraverse(
				result,
				path.slice(0, path.length - 1)
			);
			position[key] = callback(value, key, path, object, target);
		},
		depthFirst
	);
	return result;
}

function deepObjectFilter(
	target,
	callback,
	includeIntermediate = false,
	depthFirst = false
) {
	const result = {};
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			if (callback(value, key, path, object, target)) {
				const position = _deepObjectTraverse(
					result,
					path.slice(0, path.length - 1)
				);
				position[key] = value;
			}
		},
		depthFirst
	);
	return result;
}

function deepObjectFind(
	target,
	callback,
	includeIntermediate = false,
	depthFirst = false
) {
	let foundValue;
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (foundValue !== undefined) return;
			if (isObject && !includeIntermediate) return;
			if (callback(value, key, path, object, target)) {
				foundValue = value;
			}
		},
		depthFirst
	);
	return foundValue;
}

function deepObjectSome(
	target,
	callback,
	includeIntermediate = false,
	depthFirst = false
) {
	return (
		undefined !==
		deepObjectFind(target, callback, includeIntermediate, depthFirst)
	);
}

function deepObjectEvery(
	target,
	callback,
	includeIntermediate = false,
	depthFirst = false
) {
	let every = true;
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (!every) return;
			if (isObject && !includeIntermediate) return;
			every = every && callback(value, key, path, object, target);
		},
		depthFirst
	);
	return every;
}

function deepObjectForEach(
	target,
	callback,
	includeIntermediate = false,
	depthFirst = false
) {
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			callback(value, key, path, object, target);
		},
		depthFirst
	);
}

function deepObjectValues(
	target,
	includeIntermediate = false,
	depthFirst = false
) {
	const values = [];
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			values.push(value);
		},
		depthFirst
	);
	return values;
}

function deepObjectPaths(
	target,
	includeIntermediate = false,
	depthFirst = false
) {
	const paths = [];
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			paths.push(path);
		},
		depthFirst
	);
	return paths;
}

function deepObjectKeys(
	target,
	includeIntermediate = false,
	depthFirst = false
) {
	const keys = [];
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			keys.push(key);
		},
		depthFirst
	);
	return keys;
}

function deepObjectEntries(
	target,
	includeIntermediate = false,
	depthFirst = false
) {
	const entries = [];
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			entries.push([key, value, path]);
		},
		depthFirst
	);
	return entries;
}

module.exports = {
	deepObjectForEach,
	deepObjectMap,
	deepObjectFilter,
	deepObjectFind,
	deepObjectSome,
	deepObjectEvery,
	deepObjectValues,
	deepObjectPaths,
	deepObjectKeys,
	deepObjectEntries,
	forEach: deepObjectForEach,
	map: deepObjectMap,
	filter: deepObjectFilter,
	find: deepObjectFind,
	some: deepObjectSome,
	every: deepObjectEvery,
	values: deepObjectValues,
	paths: deepObjectPaths,
	keys: deepObjectKeys,
	entries: deepObjectEntries,
};
