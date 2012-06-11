(function ($) {

module("Backend Memory - DataWrapper");

var memoryData = [
  {id: 0, x: 1, y: 2, z: 3, country: 'DE', label: 'first'}
  , {id: 1, x: 2, y: 4, z: 6, country: 'UK', label: 'second'}
  , {id: 2, x: 3, y: 6, z: 9, country: 'US', label: 'third'}
  , {id: 3, x: 4, y: 8, z: 12, country: 'UK', label: 'fourth'}
  , {id: 4, x: 5, y: 10, z: 15, country: 'UK', label: 'fifth'}
  , {id: 5, x: 6, y: 12, z: 18, country: 'DE', label: 'sixth'}
];

var _wrapData = function() {
  var dataCopy = $.extend(true, [], memoryData);
  return new recline.Backend.Memory.DataWrapper(dataCopy);
}

test('basics', function () {
  var data = _wrapData();
  equal(data.fields.length, 6);
  deepEqual(['id', 'x', 'y', 'z', 'country', 'label'], _.pluck(data.fields, 'id'));
  equal(memoryData.length, data.data.length);
});

test('query', function () {
  var data = _wrapData();
  var queryObj = {
    size: 4
    , from: 2
  };
  var out = data.query(queryObj);
  deepEqual(out.documents[0], memoryData[2]);
  equal(out.documents.length, 4);
  equal(out.total, 6);
});

test('query sort', function () {
  var data = _wrapData();
  var queryObj = {
    sort: [
      {'y': {order: 'desc'}}
    ]
  };
  var out = data.query(queryObj);
  equal(out.documents[0].x, 6);
});

test('query string', function () {
  var data = _wrapData();
  var out = data.query({q: 'UK'});
  equal(out.total, 3);
  deepEqual(_.pluck(out.documents, 'country'), ['UK', 'UK', 'UK']);

  var out = data.query({q: 'UK 6'})
  equal(out.total, 1);
  deepEqual(out.documents[0].id, 1);
});

test('filters', function () {
  var data = _wrapData();
  var query = new recline.Model.Query();
  query.addTermFilter('country', 'UK');
  var out = data.query(query.toJSON());
  equal(out.total, 3);
  deepEqual(_.pluck(out.documents, 'country'), ['UK', 'UK', 'UK']);
});

test('facet', function () {
  var data = _wrapData();
  var query = new recline.Model.Query();
  query.addFacet('country');
  var out = data.computeFacets(data.data, query.toJSON());
  var exp = [
    {
      term: 'UK',
      count: 3
    },
    {
      term: 'DE',
      count: 2
    },
    {
      term: 'US',
      count: 1
    }
  ];
  deepEqual(out['country'].terms, exp);
});
 
test('update and delete', function () {
  var data = _wrapData();
  // Test UPDATE
  var newVal = 10;
  doc1 = $.extend(true, {}, memoryData[0]);
  doc1.x = newVal;
  data.update(doc1);
  equal(data.data[0].x, newVal);

  // Test Delete
  data.delete(doc1);
  equal(data.data.length, 5);
  equal(data.data[0].x, memoryData[1].x);
});

})(this.jQuery);

// ======================================

(function ($) {

module("Backend Memory - Backbone");

var memoryData = {
  metadata: {
    title: 'My Test Dataset'
    , name: '1-my-test-dataset' 
    , id: 'test-dataset'
  },
  fields: [{id: 'x'}, {id: 'y'}, {id: 'z'}, {id: 'country'}, {id: 'label'}],
  documents: [
    {id: 0, x: 1, y: 2, z: 3, country: 'DE', label: 'first'}
    , {id: 1, x: 2, y: 4, z: 6, country: 'UK', label: 'second'}
    , {id: 2, x: 3, y: 6, z: 9, country: 'US', label: 'third'}
    , {id: 3, x: 4, y: 8, z: 12, country: 'UK', label: 'fourth'}
    , {id: 4, x: 5, y: 10, z: 15, country: 'UK', label: 'fifth'}
    , {id: 5, x: 6, y: 12, z: 18, country: 'DE', label: 'sixth'}
  ]
};

function makeBackendDataset() {
  var dataset = new recline.Backend.Memory.createDataset(memoryData.documents, null, memoryData.metadata);
  return dataset;
}

test('createDataset', function () {
  var dataset = recline.Backend.Memory.createDataset(memoryData.documents);
  equal(dataset.fields.length, 6);
  deepEqual(['id', 'x', 'y', 'z', 'country', 'label'], dataset.fields.pluck('id'));
  dataset.query();
  equal(memoryData.documents.length, dataset.currentDocuments.length);
});

test('basics', function () {
  var dataset = makeBackendDataset();
  expect(3);
  // convenience for tests - get the data that should get changed
  var data = dataset._dataCache;
  dataset.fetch().then(function(datasetAgain) {
    equal(dataset.get('name'), memoryData.metadata.name);
    deepEqual(_.pluck(dataset.fields.toJSON(), 'id'), _.pluck(data.fields, 'id'));
    equal(dataset.docCount, 6);
  });
});

test('query', function () {
  var dataset = makeBackendDataset();
  // convenience for tests - get the data that should get changed
  var data = dataset._dataCache.data;
  var dataset = makeBackendDataset();
  var queryObj = {
    size: 4
    , from: 2
  };
  dataset.query(queryObj).then(function(documentList) {
    deepEqual(data[2], documentList.models[0].toJSON());
  });
});

test('query sort', function () {
  var dataset = makeBackendDataset();
  // convenience for tests - get the data that should get changed
  var data = dataset._dataCache.data;
  var queryObj = {
    sort: [
      {'y': {order: 'desc'}}
    ]
  };
  dataset.query(queryObj).then(function() {
    var doc0 = dataset.currentDocuments.models[0].toJSON();
    equal(doc0.x, 6);
  });
});

test('query string', function () {
  var dataset = makeBackendDataset();
  dataset.fetch();
  dataset.query({q: 'UK'}).then(function() {
    equal(dataset.currentDocuments.length, 3);
    deepEqual(dataset.currentDocuments.pluck('country'), ['UK', 'UK', 'UK']);
  });

  dataset.query({q: 'UK 6'}).then(function() {
    equal(dataset.currentDocuments.length, 1);
    deepEqual(dataset.currentDocuments.models[0].id, 1);
  });
});

test('filters', function () {
  var dataset = makeBackendDataset();
  dataset.queryState.addTermFilter('country', 'UK');
  dataset.query().then(function() {
    equal(dataset.currentDocuments.length, 3);
    deepEqual(dataset.currentDocuments.pluck('country'), ['UK', 'UK', 'UK']);
  });
});

test('facet', function () {
  var dataset = makeBackendDataset();
  dataset.queryState.addFacet('country');
  dataset.query().then(function() {
    equal(dataset.facets.length, 1);
    var exp = [
      {
        term: 'UK',
        count: 3
      },
      {
        term: 'DE',
        count: 2
      },
      {
        term: 'US',
        count: 1
      }
    ];
    deepEqual(dataset.facets.get('country').toJSON().terms, exp);
  });
});
 
test('update and delete', function () {
  var dataset = makeBackendDataset();
  // convenience for tests - get the data that should get changed
  var data = dataset._dataCache;
  dataset.query().then(function(docList) {
    equal(docList.length, Math.min(100, data.data.length));
    var doc1 = docList.models[0];
    deepEqual(doc1.toJSON(), data.data[0]);

    // Test UPDATE
    var newVal = 10;
    doc1.set({x: newVal});
    doc1.save().then(function() {
      equal(data.data[0].x, newVal);
    })

    // Test Delete
    doc1.destroy().then(function() {
      equal(data.data.length, 5);
      equal(data.data[0].x, memoryData.documents[1].x);
    });
  });
});

})(this.jQuery);
