const endpoints = [
	{
		name : 'get_beatmap',
		type : 'public',
		params : [
			{ name : 'key', type : 'string', mandatory : true, length : 32 }, {
				name : 'beatmap_id',
				type : 'int',
				mandatory : true,
				range : [ 1, 16777216 ]
			}
		]
	},
	{
		name : 'get_beatmapset',
		type : 'public',
		params : [
			{ name : 'key', type : 'string', mandatory : true, length : 32 }, {
				name : 'beatmapset_id',
				type : 'int',
				mandatory : true,
				range : [ 1, 16777216 ]
			}
		]
	},
	{
		name : 'get_skillset',
		type : 'public',
		params : [
			{ name : 'key', type : 'string', mandatory : true, length : 32 }, {
				name : 'beatmap_id',
				type : 'int',
				mandatory : true,
				range : [ 1, 16777216 ]
			}
		]
	},
	{
		name : 'get_beatmap_sort',
		type : 'public',
		params : [
			{ name : 'key', type : 'string', mandatory : true, length : 32 },
			{ name : 'min_od', type : 'float', range : [ 0.1, 10 ] },
			{ name : 'max_od', type : 'float', range : [ 0.1, 10 ] },
			{ name : 'min_cs', type : 'float', range : [ 0.1, 10 ] },
			{ name : 'max_cs', type : 'float', range : [ 0.1, 10 ] },
			{ name : 'min_hp', type : 'float', range : [ 0.1, 10 ] },
			{ name : 'max_hp', type : 'float', range : [ 0.1, 10 ] },
			{ name : 'min_sr', type : 'float', range : [ 0.1, 20 ] },
			{ name : 'max_sr', type : 'float', range : [ 0.1, 20 ] },
			{ name : 'max_ar', type : 'float', range : [ 0.1, 10 ] },
			{ name : 'min_length', type : 'int', range : [ 1, 10000 ] },
			{ name : 'max_length', type : 'int', range : [ 1, 10000 ] },
			{ name : 'skillset', type : 'string' }, {
				name : 'status',
				type : 'string',
				values :
					[ 'graveyard', 'ranked', 'loved', 'qualified', 'approved' ]
			},
			{ name : 'max_sort', type : 'int', range : [ 0, 5000 ] },
			{ name : 'order_by', type : 'string', values : [ 'asc', 'desc' ] }
		]
	},
	// ... d'autres endpoints publics

	{
		name : 'process_command',
		type : 'private',
		params : [
			{ name : 'key', type : 'string', mandatory : true, length : 32 },
			{ name : 'command', type : 'string', mandatory : true },
			{ name : 'ts', type : 'int', mandatory : true },
			{ name : 'user', type : 'string', mandatory : true },
			{ name : 'token', type : 'string', mandatory : true }
		]
	},
	{
		name : 'login',
		type : 'private',
		params : [
			{ name : 'key', type : 'string', mandatory : true, length : 32 },
			{ name : 'login', type : 'string', mandatory : true },
			{ name : 'password', type : 'string', mandatory : true },
			{ name : 'ts', type : 'int', mandatory : true },
			{ name : 'ip', type : 'string', mandatory : true },
			{ name : 'token', type : 'string', mandatory : true },
			{ name : 'host', type : 'string', mandatory : true }
		]
	},
	{
		name : 'logout',
		type : 'private',
		params : [
			{ name : 'key', type : 'string', mandatory : true, length : 32 },
			{ name : 'login', type : 'string', mandatory : true },
			{ name : 'password', type : 'string', mandatory : true },
			{ name : 'ts', type : 'int', mandatory : true },
			{ name : 'ip', type : 'string', mandatory : true },
			{ name : 'token', type : 'string', mandatory : true },
			{ name : 'host', type : 'string', mandatory : true }
		]
	} // ... d'autres endpoints privés
];

module.exports = endpoints;