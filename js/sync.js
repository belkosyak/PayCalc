define(['backbone', 'App', 'Event', 'Subject', 'Partner', 'Payment'],
function (Backbone, App, Event, PaymentSubject, Partner, Payment) {
  var app;

  Backbone.sync = function(method, model, options) {
    var appData = localStorage['PayCalcModel'] ?
                   JSON.parse(localStorage['PayCalcModel']) : {lastID: 0};
    if (method == 'read' && model instanceof App) {
      app = model;
      model.initModels(appData);
      return;
    }

    var modelType = determineModelType(model);
    switch (method) {
      case 'create':
        var id = appData.lastID + 1;
        appData.lastID = id;
        model.set('id', id);
        if (!appData[modelType])
          appData[modelType] = {};

        appData[modelType][id] = model.toJSON();
        app.addModel(model);
        break;
      case 'read':
        if (appData[modelType] && appData[modelType][model.id]) {
          options.success && options.success(appData[modelType][model.id]);
        }
        break;
      case 'update':
        appData[modelType][model.id] = model.toJSON();
        break;
      case 'delete':
        delete appData[modelType][model.id];
        break;
    }
    localStorage['PayCalcModel'] = JSON.stringify(appData);
  };

  function determineModelType (model) {
    if (model instanceof Event) {
      return 'Event';
    } else if (model instanceof PaymentSubject) {
      return 'PaymentSubject';
    } else if (model instanceof Partner) {
      return 'Partner';
    } else if (model instanceof Payment) {
      return 'Payment';
    }
  };
});
