const deepObject = require('./src/deep-object.js');

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

console.log(deepObject.find(targetObject, (value, key) => key === 'foo'));
console.log(deepObject.find(targetObject, (value, key) => key === 'foo', false, true));
