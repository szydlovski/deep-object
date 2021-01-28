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

export {
  testObject, testObjectTotalLength,
  testObjectValues, testObjectValuesDepthFirst,
  testObjectKeys, testObjectKeysDepthFirst,
  testObjectPaths, testObjectPathsDepthFirst,
  testObjectEntries, testObjectEntriesDepthFirst
}