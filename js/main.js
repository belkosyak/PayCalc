require.config({
  urlArgs: "ver=v1",
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'underscore': '../bower_components/underscore/underscore-min',
    'backbone': '../bower_components/backbone/backbone',
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
    'AddPaymentSubjectSponsorPageView': 'views/pages/AddPaymentSubjectSponsorPageView',
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
