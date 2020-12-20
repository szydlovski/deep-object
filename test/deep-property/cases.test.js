module.exports = () => {
	const dataObject = {
		firstName: 'John',
		lastName: 'Doe',
		age: 43,
		job: {
			title: 'Senior Engineer',
			experienceYears: 17,
			retirementPlan: undefined,
			compensation: {
				salary: {
					amount: 5000,
					currency: 'USD',
				},
			},
		},
		address: {
			street: 'Oak Drive 23A',
			country: {
				code: 'US',
				name: 'United States',
				continent: {
					name: 'North America',
					hemisphere: 'western',
				},
			},
		},
	};

	const propertiesToSet = [
		{
			path: ['address', 'country', 'population'],
			value: 350000000,
			retrieveValue: (obj) => obj.address.country.population,
		},
		{
			path: 'job.seniorityLevel',
			value: {
				numerical: 5,
				textual: 'like, really senior'
			},
			retrieveValue: (obj) => obj.job.seniorityLevel,
		},
		{
			path: 'maritalStatus',
			value: 'bachelor',
			retrieveValue: (obj) => obj.maritalStatus,
		},
	];

	const propertiesToOverwrite = [
		{
			path: ['job', 'title'],
			value: 'CTO',
			retrieveValue: (obj) => obj.job.title,
		},
		{
			path: 'address.country.name',
			value: 'Canada',
			retrieveValue: (obj) => obj.address.country.name,
		},
		{
			path: 'lastName',
			value: 'Smith',
			retrieveValue: (obj) => obj.lastName,
		}
	];

	const arrayPaths = [
		{
			path: ['address', 'street'],
			value: 'Oak Drive 23A',
		},
		{
			path: ['job', 'compensation', 'salary', 'amount'],
			value: 5000,
		},
	];

	const dotPaths = [
		{
			path: 'address.country.code',
			value: 'US',
		},
		{
			path: 'job.retirementPlan',
			value: undefined,
		},
	];

	const stringPaths = [
		{
			path: 'firstName',
			value: 'John',
		},
		{
			path: 'age',
			value: 43,
		},
	];

	const nonexistantPaths = [
		['address', 'streetNumber'],
		'address.room.number',
		'job.compensation.profitShare',
		'hobbies',
	];

	const invalidPaths = [
		['a', 'lot', 'of', 'string', 'but', 'then', null],
		null,
		undefined,
		0,
		1,
		NaN,
		Infinity,
		true,
		false,
		[true, 1],
		['string', function notAString() {}],
	];

	const dataObjectWithUndefined = {
		one: {
			two: {
				three: undefined,
			},
		},
	};

	const pathToUndefined = ['one', 'two', 'three'];

	return {
		dataObject,
		arrayPaths,
		dotPaths,
		stringPaths,
		invalidPaths,
		validPaths: [...arrayPaths, ...dotPaths, ...stringPaths],
		nonexistantPaths,
		dataObjectWithUndefined,
		pathToUndefined,
		propertiesToSet,
		propertiesToOverwrite
	};
};
