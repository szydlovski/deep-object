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

// all array-like functions are also accessible as deepObject<function>, i.e.:

const { deepObjectForEach } = deepObject;
```
This library also contains a set of function designed for handling specific nested properties.

```javascript
const breed = {};

// works with dot paths and arrays
deepObject.setProperty(breed, 'name', 'Pembroke Welsh Corgi');
deepObject.setProperty(breed, 'traits.coat.length', 'medium');
deepObject.setProperty(breed, ['traits', 'coat', 'thickness'], 'thick');
deepObject.setProperty(breed, 'traits.lifeSpan', [12, 15]);

deepObject.getProperty(breed, ['traits', 'coat', 'length']); => "medium"
deepObject.getProperty(breed, 'traits.coat.thickness'); => "thick"
deepObject.getProperty(breed, 'traits.coat.color'); => undefined

deepObject.hasProperty(breed, 'traits.coat.thickness'); => true
deepObject.hasProperty(breed, 'traits.weight'); => false

deepObject.extractProperty(breed, 'traits.coat.length'); => [true, "medium"]
deepObject.extractProperty(breed, 'traits.weight'); => [false, undefined]

// all property functions are also accessible as <function>DeepProperty, i.e.:

const {
  setDeepProperty,
  getDeepProperty,
  hasDeepProperty,
  extractDeepProperty
} = deepObject;

setDeepProperty(breed, 'traits.butt.cuteness', 'very');
hasDeepProperty(breed, 'traits.butt.cuteness') // true
getDeepProperty(breed, 'traits.butt.cuteness') // "very"
extractDeepProperty(breed, 'traits.butt.cuteness') // [true, "very"]

// the resulting object

{
  name: 'Pembroke Welsh Corgi',
  traits: {
    coat: {
      length: 'medium',
      thickness: 'thick'
    },
    lifeSpan: [ 12, 15 ],
    butt: {
      cuteness: 'very'
    }
  }
}
```

# Deep Object API

This library implements most of the built in JavaScript array methods adapted for deeply nested objects. All of them take the same arguments:

- `targetObject` - object, required.
- `includeIntermediate` - boolean, optional, defaults to `false`. Controls whether intermediate values should be included as entries, otherwise only final values (those that are not objects) will be. See [Intermediate values](#intermediate-values).
- `depthFirst` - boolean, optional, defaults for `false`. By default objects are traversed breadth first, this option allows them to be traversed depth first. See [Breadth first vs Depth first](#breadth-first-vs-depth-first)

In addition, `forEach`, `map`, `filter`, `find`, `some` and `every` take as the second argument:
- `callback` - function, required. Callbacks are called with the following arguments:
  - `value` - property value
  - `key` - shallow property name
  - `path` - an array of property names leading to the current property
  - `nestedObject` - the nested object containing the current property
  - `targetObject` - the original target object

All functions are exported by their short name (e.g. `map`) as well as their long name (e.g. `deepObjectMap`).

## deepObjectForEach

Executes a provided function once for each nested property of the target object.

## deepObjectMap

Creates a new object populated with the results of calling a provided function on every nested property.

## deepObjectFilter

Creates a new object populated with all nested properties that pass the test implemented by the provided function.

## deepObjectFind

Returns the value of the first nested property in the provided object that satisfies the provided testing function.

## deepObjectSome

Tests whether at least one nested property in the object passes the test implemented by the provided function.

## deepObjectEvery

Tests whether all nested properties in the object pass the test implemented by the provided function.

## deepObjectKeys

Returns an array that contains the object's nested property values.

## deepObjectValues

Returns an array that contains the object's nested property names.

## deepObjectPaths

Returns an array that contains the object's nested property paths.

## deepObjectEntries

Returns an array that contains the objects `[key, value, path]` tuples (a combination of the keys, values and paths functions);

# Deep Property API

As the first two arguments all functions accept:
- `targetObject` - target object
- `path` - path to the target property, given as a dot path or an array of strings

In addition, `setDeepProperty` accepts a `value` for the property as its third argument.

## setDeepProperty

Sets the property at `path` on `targetObject` to `value`. Returns the modified object.

## getDeepProperty

Returns the value of the property at `path` on `targetObject`.

## hasDeepProperty

Returns `true` if the property at `path` on `targetObject` is set, and `false` if it is not. 

If the property at `path` is explicitly set to `undefined` (e.g. `{foo: undefined}`), this function will return `true`.

## extractDeepProperty

Returns an array containing:
- `true` if the property at `path` on `targetObject` is set, and `false` if it is not
- value of the property at `path` on `targetObject`

If the property at `path` is explicitly set to `undefined` (e.g. `{foo: undefined}`), this function will return `[true, undefined]`.

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

# License

Copyright 2020 Kamil Szydlowski

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.