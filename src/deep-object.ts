import {
	_deepObjectOperation,
	_isObject,
	_deepObjectTraverse,
	StringIndexed,
} from './core.js';

type DeepObjectCallback<T> = (value: any, key: string, path: string[], object: object, target: object) => T;

function deepObjectMap<T = StringIndexed>(
	target: StringIndexed,
	callback: DeepObjectCallback<any>,
	includeIntermediate = false,
	depthFirst = false
): T {
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
	return result as T;
}

function deepObjectFilter<T = StringIndexed>(
	target: StringIndexed,
	callback: DeepObjectCallback<boolean>,
	includeIntermediate = false,
	depthFirst = false
): T {
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
	return result as T;
}

function deepObjectFind<T = any>(
	target: StringIndexed,
	callback: DeepObjectCallback<boolean>,
	includeIntermediate = false,
	depthFirst = false
): T | undefined {
	let foundValue: T | undefined = undefined;
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
	target: StringIndexed,
	callback: DeepObjectCallback<boolean>,
	includeIntermediate = false,
	depthFirst = false
): boolean {
	return (
		undefined !==
		deepObjectFind(target, callback, includeIntermediate, depthFirst)
	);
}

function deepObjectEvery(
	target: StringIndexed,
	callback: DeepObjectCallback<boolean>,
	includeIntermediate = false,
	depthFirst = false
): boolean {
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
	target: StringIndexed,
	callback: DeepObjectCallback<void>,
	includeIntermediate = false,
	depthFirst = false
): void {
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			callback(value, key, path, object, target);
		},
		depthFirst
	);
}

function deepObjectValues<T extends any[] = any[]>(
	target: StringIndexed,
	includeIntermediate = false,
	depthFirst = false
): T {
	const values: any[] = [];
	_deepObjectOperation(
		target,
		(value, key, path, object, isObject) => {
			if (isObject && !includeIntermediate) return;
			values.push(value);
		},
		depthFirst
	);
	return values as T;
}

function deepObjectPaths(target: StringIndexed, includeIntermediate = false, depthFirst = false): string[][] {
	const paths: string[][] = [];
	_deepObjectOperation(
		target,
		(_1, _2, path, _3, isObject) => {
			if (isObject && !includeIntermediate) return;
			paths.push(path);
		},
		depthFirst
	);
	return paths;
}

function deepObjectKeys(target: StringIndexed, includeIntermediate = false, depthFirst = false): string[] {
	const keys: string[] = [];
	_deepObjectOperation(target, (_1, key, _2, _3, isObject) => {
		if (isObject && !includeIntermediate) return;
		keys.push(key);
	},
		depthFirst
	);
	return keys;
}

function deepObjectEntries(
	target: StringIndexed,
	includeIntermediate = false,
	depthFirst = false
): [string, any, string[]][] {
	const entries: [string, any, string[]][] = [];
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

export {
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
	deepObjectForEach as forEach,
	deepObjectMap as map,
	deepObjectFilter as filter,
	deepObjectFind as find,
	deepObjectSome as some,
	deepObjectEvery as every,
	deepObjectValues as values,
	deepObjectPaths as paths,
	deepObjectKeys as keys,
	deepObjectEntries as entries,
};
