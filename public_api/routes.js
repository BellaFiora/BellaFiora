const endpoints = [
    {
      name: 'register',
      type: 'private',
      params: []
    },
    {
      name: 'login',
      type: 'private',
      params: []
    },
    {
      name: 'logs',
      type: 'private',
      params: []
    },
    {
      name: 'syncdata',
      type: 'private',
      params: []
    },
    {
      name: 'get_beatmap',
      type: 'public',
      params: [
        { name: 'key', type: 'string', mandatory: true, length: 32 },
        { name: 'bmid', type: 'int', mandatory: true, length: 32 },
        { name: 'bmsetid', type: 'int', mandatory: true, length: 32 },
      ]
    },   
    {
      name: 'get_beatmapset',
      type: 'public',
      params: [
        { name: 'key', type: 'string', mandatory: true, length: 32 },
        { name: 'bmid', type: 'int', mandatory: true, length: 32 },
        { name: 'bmsetid', type: 'int', mandatory: true, length: 32 },
      ]
    },   
    {
      name: 'search_beatmaps',
      type: 'public',
      params: [
        { name: 'key', type: 'string', mandatory: true, length: 32 },
        { name: 'min_od', type: 'float', range: [0.1, 10] },
        { name: 'max_od', type: 'float', range: [0.1, 10] },
        { name: 'min_cs', type: 'float', range: [0.1, 10] },
        { name: 'max_cs', type: 'float', range: [0.1, 10] },
        { name: 'min_hp', type: 'float', range: [0.1, 10] },
        { name: 'max_hp', type: 'float', range: [0.1, 10] },
        { name: 'min_sr', type: 'float', range: [0.1, 20] },
        { name: 'max_sr', type: 'float', range: [0.1, 20] },
        { name: 'max_ar', type: 'float', range: [0.1, 10] },
        { name: 'min_length', type: 'int', range: [1, 10000] },
        { name: 'max_length', type: 'int', range: [1, 10000] },
        { name: 'skillset', type: 'string' },
        { name: 'status', type: 'string', values: ['graveyard', 'ranked', 'loved', 'qualified', 'approved']},
        { name: 'max_sort', type: 'int', range: [0, 5000] },
        { name: 'order_by', type: 'string', values: ['asc', 'desc'] }
        //answer params for next..
      ]
    },       
  ];
  
  module.exports = endpoints;