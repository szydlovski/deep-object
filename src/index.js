const deepObject = require('./deep-object.js')
const deepProperty = require('./deep-property.js')

module.exports = {
	...deepObject,
	...deepProperty
}