function _deepObjectOperation(
	target,
	callback,
	depthFirst,
	pathSoFar = []
) {
	function traverseDepth(target, callback, depthFirst, pathSoFar) {
		for (const [key, value] of Object.entries(target)) {
			const isObject = _isObject(value);
			if (isObject) {
				const path = [...pathSoFar, key];
				_deepObjectOperation(value, callback, depthFirst, path);
			}
		}
	}
	function traverseBreadth(target, callback, pathSoFar) {
		for (const [key, value] of Object.entries(target)) {
			const isObject = _isObject(value);
			const path = [...pathSoFar, key];
			callback(value, key, path, target, isObject);
		}
	}
	if (depthFirst) {
		traverseDepth(target, callback, depthFirst, pathSoFar);
		traverseBreadth(target, callback, pathSoFar);
	} else {
		traverseBreadth(target, callback, pathSoFar);
		traverseDepth(target, callback, depthFirst, pathSoFar);
	}
}

function _isObject(value) {
	return (
		value !== null && typeof value === 'object' && value.constructor === Object
	);
}

function deepObjectOperation(target, callback, depthFirst) {
	_deepObjectOperation(target, callback, depthFirst);
}

function deepObjectTraverse(target, path) {
	path = [...path];
	let step;
	while ((step = path.shift())) {
		if (!_isObject(target[step])) {
			target[step] = {};
		}
		target = target[step];
	}
	return target;
}

function deepObjectMap(target, callback, includeIntermediate = false, depthFirst = false) {
	const result = {};
	deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			const position = deepObjectTraverse(
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
	deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			if (callback(value, key, path, object, target)) {
				const position = deepObjectTraverse(
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
	deepObjectOperation(
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
	return undefined !== deepObjectFind(target, callback, includeIntermediate, depthFirst);
}

function deepObjectEvery(
	target,
	callback,
	includeIntermediate = false,
	depthFirst = false
) {
	let every = true;
	deepObjectOperation(
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
	deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			callback(value, key, path, object, target);
		},
		depthFirst
	);
}

function deepObjectValues(target, includeIntermediate = false, depthFirst = false) {
	const values = [];
	deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			values.push(value);
		},
		depthFirst
	);
	return values;
}

function deepObjectPaths(target, includeIntermediate = false, depthFirst = false) {
	const paths = [];
	deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			paths.push(path);
		},
		depthFirst
	);
	return paths;
}

function deepObjectKeys(target, includeIntermediate = false, depthFirst = false) {
	const keys = [];
	deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			keys.push(key);
		},
		depthFirst
	);
	return keys;
}

function deepObjectEntries(target, includeIntermediate = false, depthFirst = false) {
	const entries = [];
	deepObjectOperation(
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
