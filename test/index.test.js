const { expect } = require('chai');
const deepObject = require('../src/deep-object.js');

const testObject = {
	foo: 'bar1',
	baz: {
		foo: 'foo2',
		bar: {
			foo: 'bar3',
			baz: {
				bar: 'foo4',
			},
		},
	},
	bar: 'baz1',
};

const testObjectValues = ['bar1', 'baz1', 'foo2', 'bar3', 'foo4'];
const testObjectValuesDepthFirst = ['foo4', 'bar3', 'foo2', 'bar1', 'baz1'];

const testObjectTotalLength = 8;

const testObjectKeys = ['foo', 'bar', 'foo', 'foo', 'bar'];
const testObjectKeysDepthFirst = ['bar', 'foo', 'foo', 'foo', 'bar'];

const testObjectPaths = [
	'foo',
	'bar',
	'baz.foo',
	'baz.bar.foo',
	'baz.bar.baz.bar',
];
const testObjectPathsDepthFirst = [
	'baz.bar.baz.bar',
	'baz.bar.foo',
	'baz.foo',
	'foo',
	'bar',
];

const testObjectEntries = buildDeepObjectEntries(testObjectKeys, testObjectValues, testObjectPaths);
const testObjectEntriesDepthFirst = buildDeepObjectEntries(testObjectKeysDepthFirst, testObjectValuesDepthFirst, testObjectPathsDepthFirst);

function buildDeepObjectEntries(keys, values, paths) {
  paths = paths.map(path => path.split('.'));
  return keys.map((key, index) => [key, values[index], paths[index]]);
}

describe('deepObjectForEach', function () {
	it('executes a provided function once for each nested property', function () {
		const values = [];
		deepObject.forEach(testObject, (value) => values.push(value));
		expect(values).to.deep.equal(testObjectValues);
	});
	it('depth first', function () {
		const values = [];
		deepObject.forEach(testObject, (value) => values.push(value), false, true);
		expect(values).to.deep.equal(testObjectValuesDepthFirst);
	});
	it('including intermediate objects', function () {
		let calls = 0;
		deepObject.forEach(testObject, () => calls++, true);
		expect(calls).to.equal(testObjectTotalLength);
	});
});

describe('deepObjectMap', function () {
	it('creates a new object populated with the results of calling a provided function on every nested property', function () {
		const result = deepObject.map(testObject, (value) => value + value);
		expect(result).to.deep.equal({
			foo: 'bar1bar1',
			baz: {
				foo: 'foo2foo2',
				bar: {
					foo: 'bar3bar3',
					baz: {
						bar: 'foo4foo4',
					},
				},
			},
			bar: 'baz1baz1',
		});
	});
});

describe('deepObjectFilter', function () {
	it('creates a new object populated with all nested properties that pass the test implemented by the provided function', function () {
		const result = deepObject.filter(testObject, (value, key) => key === 'foo');
		expect(result).to.deep.equal({
			foo: 'bar1',
			baz: {
				foo: 'foo2',
				bar: {
					foo: 'bar3',
				},
			},
		});
	});
});

describe('deepObjectFind', function () {
	it('returns the value of the first nested property in the provided object that satisfies the provided testing function', function () {
		const testCases = [
			{
				seekedKey: 'foo',
				expectedResult: 'bar1',
			},
			{
				seekedKey: 'woof',
				expectedResult: undefined,
			},
		];
		for (const { seekedKey, expectedResult } of testCases) {
			const result = deepObject.find(
				testObject,
				(value, key) => key === seekedKey
			);
			expect(result).to.deep.equal(expectedResult);
		}
	});
	it('depth first', function () {
		expect(
			deepObject.find(testObject, (value, key) => key === 'foo', false, true)
		).to.deep.equal('bar3');
	});
});

describe('deepObjectSome', function () {
	it('tests whether at least one nested property in the object passes the test implemented by the provided function', function () {
		const testCases = [
			{
				expectedResult: true,
				testFunction: (value) => value === 'bar1',
			},
			{
				expectedResult: false,
				testFunction: (value) => value === 'woof',
			},
		];
		for (const { expectedResult, testFunction } of testCases) {
			expect(deepObject.some(testObject, testFunction)).to.be[expectedResult];
		}
	});
});

describe('deepObjectEvery', function () {
	it('tests whether all nested properties in the object pass the test implemented by the provided function', function () {
		const testCases = [
			{
				expectedResult: true,
				testFunction: (value, key) => ['foo', 'bar', 'baz'].includes(key),
			},
			{
				expectedResult: false,
				testFunction: (value, key) => ['foo'].includes(key),
			},
			{
				expectedResult: false,
				testFunction: (value) => value === 'woof',
			},
			{
				expectedResult: true,
				testFunction: (value) => typeof value === 'string',
			},
		];
		for (const { expectedResult, testFunction } of testCases) {
			expect(deepObject.every(testObject, testFunction)).to.be[expectedResult];
		}
	});
});

describe('deepObjectValues', function () {
	it('returns an array that contains the values for each nested property in the object', function () {
		expect(deepObject.values(testObject)).to.deep.equal(testObjectValues);
	});
	it('depth first', function () {
		expect(deepObject.values(testObject, false, true)).to.deep.equal(
			testObjectValuesDepthFirst
		);
	});
});

describe('deepObjectKeys', function () {
	it('returns an array that contains the objects nested property names', function () {
		expect(deepObject.keys(testObject)).to.deep.equal(testObjectKeys);
	});
	it('depth first', function () {
		expect(deepObject.keys(testObject, false, true)).to.deep.equal(
			testObjectKeysDepthFirst
		);
	});
});

describe('deepObjectPaths', function () {
	it('returns an array that contains the objects property paths', function () {
		expect(deepObject.paths(testObject)).to.deep.equal(
			testObjectPaths.map((path) => path.split('.'))
		);
	});
	it('depth first', function () {
		expect(deepObject.paths(testObject, false, true)).to.deep.equal(
			testObjectPathsDepthFirst.map((path) => path.split('.'))
		);
	});
});

describe('deepObjectEntries', function () {
	it('returns an array that contains the objects [key, value, path] tuples', function () {
		expect(deepObject.entries(testObject)).to.deep.equal(
			testObjectEntries
		);
	});
	it('depth first', function () {
		expect(deepObject.entries(testObject, false, true)).to.deep.equal(
			testObjectEntriesDepthFirst
		);
	});
});
