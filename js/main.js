require.config({
  paths: {
    'jquery': 'libs/jquery',
    'underscore': 'libs/underscore',
    'backbone': 'libs/backbone',
    'App': 'models/App',
    'PayCalcModel': 'models/PayCalcModel',
    'Event': 'models/Event',
    'Partner': 'models/Partner',
    'Payment': 'models/Payment',
    'Subject': 'models/PaymentSubject',
    'PageView': 'views/pages/PageView',
    'AddEventPageView': 'views/pages/AddEventPageView',
    'AddEventPartnerPageView': 'views/pages/AddEventPartnerPageView',
    'AddPaymentPageView': 'views/pages/AddPaymentPageView',
    'EventPageView': 'views/pages/EventPageView',
    'EventsPageView': 'views/pages/EventsPageView',
    'PaymentSubjectPageView': 'views/pages/PaymentSubjectPageView',
    'NameTextFieldView': 'views/NameTextFieldView',
    'EventPartnerListItem': 'views/EventPartnerListItem',
    'EventPartnerPageView': 'views/pages/EventPartnerPageView',
    'PaymentSubjectListItem': 'views/PaymentSubjectListItem',
    'PartnerPaymentSubjectListItem': 'views/PartnerPaymentSubjectListItem',
    'PaymentSubjectPartnerListItem': 'views/PaymentSubjectPartnerListItem'
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'PageRouter': {
      deps: ['backbone']
    }
  }
});
var app = null;

require(['backbone', 'PageRouter', 'App', 'sync'],
function(Backbone, PageRouter, App) {
  app = new App();
  app.fetch();
  var router = new PageRouter(app);
  Backbone.history.start();
});
