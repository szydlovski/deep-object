import chai from 'chai';
const { expect } = chai;
import {
	setDeepProperty,
	getDeepProperty,
	hasDeepProperty,
	extractDeepProperty
}  from '../../src/deep-property.js';

import getTestCases  from './cases.test.js';

describe('extractDeepProperty', function () {
	it('returns [true, value] for existing property paths', function () {
		const { dataObject, validPaths } = getTestCases();
		for (const { path: keyPath, value: expectedValue } of validPaths) {
			const [exists, value] = extractDeepProperty(dataObject, keyPath);
			expect(exists).to.be.true;
			expect(value).to.equal(expectedValue);
		}
	});
	it('returns [false, undefined] for non-existant property paths', function () {
		const { dataObject, nonexistantPaths } = getTestCases();
		for (const keyPath of nonexistantPaths) {
			const [exists, value] = extractDeepProperty(dataObject, keyPath);
			expect(exists).to.be.false;
			expect(value).to.equal(undefined);
		}
	});
	it('returns [true, undefined] if the property value is set but equal to undefined', function () {
		const { dataObjectWithUndefined, pathToUndefined } = getTestCases();
		const [exists, value] = extractDeepProperty(
			dataObjectWithUndefined,
			pathToUndefined
		);
		expect(exists).to.be.true;
		expect(value).to.equal(undefined);
	});
	it('throws an error if the path argument is not an array or a string', function() {
		expect(function() {
			extractDeepProperty({}, 1);
		}).to.throw(TypeError, 'is not a string or an array')
	})
});

describe('getDeepProperty', function () {
	it('returns the value of existing property paths', function () {
		const { dataObject, validPaths } = getTestCases();
		for (const { path: keyPath, value: expectedValue } of validPaths) {
			const value = getDeepProperty(dataObject, keyPath);
			expect(value).to.equal(expectedValue);
		}
	});
	it('returns undefined for non-existant property paths', function () {
		const { dataObject, nonexistantPaths } = getTestCases();
		for (const keyPath of nonexistantPaths) {
			const value = getDeepProperty(dataObject, keyPath);
			expect(value).to.equal(undefined);
		}
	});
	it('returns undefined if the property value is set but equal to undefined', function () {
		const { dataObjectWithUndefined, pathToUndefined } = getTestCases();
		const value = getDeepProperty(dataObjectWithUndefined, pathToUndefined);
		expect(value).to.equal(undefined);
	});
});

describe('hasDeepProperty', function () {
	it('returns true for existing property paths', function () {
		const { dataObject, validPaths } = getTestCases();
		for (const { path: keyPath } of validPaths) {
			const exists = hasDeepProperty(dataObject, keyPath);
			expect(exists).to.be.true;
		}
	});
	it('returns false for non-existant property paths', function () {
		const { dataObject, nonexistantPaths } = getTestCases();
		for (const keyPath of nonexistantPaths) {
			const exists = hasDeepProperty(dataObject, keyPath);
			expect(exists).to.be.false;
		}
	});
	it('returns true if the property value is set but equal to undefined', function () {
		const { dataObjectWithUndefined, pathToUndefined } = getTestCases();
		const exists = hasDeepProperty(dataObjectWithUndefined, pathToUndefined);
		expect(exists).to.be.true;
	});
});

describe('setDeepProperty', function () {
	it('sets new values of deep properties', function () {
		const { propertiesToSet, dataObject } = getTestCases();
		for (const { path: keyPath, value, retrieveValue } of propertiesToSet) {
			setDeepProperty(dataObject, keyPath, value);
			expect(value).to.equal(retrieveValue(dataObject));
		}
	});
	it('overwrites existing values of deep properties', function () {
		const { propertiesToOverwrite, dataObject } = getTestCases();
		for (const {
			path: keyPath,
			value: valueToSet,
			retrieveValue,
		} of propertiesToOverwrite) {
      const oldValue = retrieveValue(dataObject);
      expect(oldValue).to.not.equal(valueToSet);
			setDeepProperty(dataObject, keyPath, valueToSet);
			const newValue = retrieveValue(dataObject);
			expect(newValue).to.equal(valueToSet);
			expect(newValue).to.not.equal(oldValue);
		}
  });
  it('returns the modified object', function() {
    const objectToModify = {};
    const keyPath = ['one', 'two', 'three'];
    const returnedObject = setDeepProperty(objectToModify, keyPath, 'some value');
    expect(returnedObject).to.equal(objectToModify);
  })
});
