# deep-object

A collection of utilities for working with deeply nested objects. Unit tested with 100% code coverage.

# Usage

```
npm install @szydlovski/deep-object
```
```javascript
const deepObject = require('@szydlovski/deep-object');

const exampleObject = {
  name: {
    first: 'John',
    last: 'Doe',
  },
  address: {
    street: '43 Aurora Road',
    city: 'Austin',
    province: {
      code: 'TX'
    }
  }
}

deepObject.keys(exampleObject); => [ 'first', 'last', 'street', 'city', 'code' ]
deepObject.values(exampleObject); => [ 'John', 'Doe', '43 Aurora Road', 'Austin', 'TX' ]

deepObject.paths(exampleObject); =>
[
  [ 'name', 'first' ],
  [ 'name', 'last' ],
  [ 'address', 'street' ],
  [ 'address', 'city' ],
  [ 'address', 'province', 'code' ]
]

deepObject.entries(exampleObject); =>
[
  [ 'first', 'John', [ 'name', 'first' ] ],
  [ 'last', 'Doe', [ 'name', 'last' ] ],
  [ 'street', '43 Aurora Road', [ 'address', 'street' ] ],
  [ 'city', 'Austin', [ 'address', 'city' ] ],
  [ 'code', 'TX', [ 'address', 'province', 'code' ] ]
]

deepObject.forEach(exampleObject, (value) => console.log(value)) =>
// John
// Doe
// 43 Aurora Road
// Austin
// TX

deepObject.map(exampleObject, (value) => value.split('').reverse().join('')); =>
{
  name: {
    first: 'nhoJ',
    last: 'eoD'
  },
  address: {
    street: 'daoR aroruA 34',
    city: 'nitsuA',
    province: {
      code: 'XT'
    }
  }
}

deepObject.filter(exampleObject, (value) => value.length < 5); =>
{
  name: {
    first: 'John',
    last: 'Doe',
  },
  address: {
    province: {
      code: 'TX'
    }
  }
}

deepObject.find(exampleObject, (value, key) => key === 'code') => "TX"
deepObject.some(exampleObject, (value) => typeof value !== 'string') => false
deepObject.every(exampleObject, (value) => typeof value === 'string') => true

// all functions are also accessible as deepObject<function>, i.e.:

const { deepObjectForEach } = require('@szydlovski/deep-object');

```

# API

This library implements most of the built in JavaScript array methods adapted for deeply nested objects. All of them take the same arguments:

- targetObject - object, required.
- includeIntermediate - boolean, optional, defaults to `false`. Controls whether intermediate values should be included as entries, otherwise only final values (those that are not objects) will be. See [Intermediate values](#intermediate-values).
- depthFirst - boolean, optional, defaults for `false`. By default objects are traversed breadth first, this option allows them to be traversed depth first. See [Breadth first vs Depth first](#breadth-first-vs-depth-first)

In addition, `forEach`, `map`, `filter`, `find`, `some` and `every` take as the second argument:
- callback - function, required. Callbacks are called with the following arguments:
  - key - shallow property name
  - value - property value
  - path - an array of property names leading to the current property
  - nestedObject - the nested object containing the current property
  - targetObject - the original target object

All functions are exported by their short name (e.g. `map`) as well as their long name (e.g. `deepObjectMap`).
## forEach

Executes a provided function once for each nested property of the target object.

## map

Creates a new object populated with the results of calling a provided function on every nested property.

## filter

Creates a new object populated with all nested properties that pass the test implemented by the provided function.

## find

Returns the value of the first nested property in the provided object that satisfies the provided testing function.

## some

Tests whether at least one nested property in the object passes the test implemented by the provided function.

## every

Tests whether all nested properties in the object pass the test implemented by the provided function.

## keys

Returns an array that contains the object's nested property values.

## values

Returns an array that contains the object's nested property names.

## paths

Returns an array that contains the object's nested property paths.

## entries

Returns an array that contains the objects `[key, value, path]` tuples (a combination of the keys, values and paths functions);

# Intermediate values

```javascript
const targetObject = {
  foo: 'bar',
  bar: {
    baz: 'foo'
  }
}

deepObject.paths(targetObject); => [ [ 'foo' ], [ 'bar', 'baz' ] ]
deepObject.paths(targetObject, true); => [ [ 'foo' ], [ 'bar' ], [ 'bar', 'baz' ] ]
```

Without `includeIntermediate === true` the property `bar` is ignored.

# Breadth first vs Depth first

```javascript
const targetObject = {
  foo: 'depth 0',
  bar: {
		bar: {
			bar: {
				foo: 'depth 3'
			}
		}
	}
}

const testFunction = (value, key) => key === 'foo';

deepObject.find(targetObject, testFunction); => "depth 0"
deepObject.find(targetObject, testFunction, false, true); => "depth 3"
```