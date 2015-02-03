define(['backbone', 'EventsPageView', 'AddEventPageView',
            'AddEventPartnerPageView', 'EventPageView', 'AddPaymentPageView',
            'EventPartnerPageView', 'PaymentSubjectPageView'],
function (Backbone, EventsPageView, AddEventPageView, AddEventPartnerPageView,
            EventPageView, AddPaymentPageView, EventPartnerPageView,
            PaymentSubjectPageView) {

  return Backbone.Router.extend({
    pageView: null,
    routes: {
      '*all': 'routePages'
    },
    paths: {
      '': 'mainPage',
      'add-event': 'addEventPage',
      'event': 'eventPage',
      'add-partner': 'addPartnerPage',
      'pay': 'addPaymentPage',
      'partner': 'partnerPage',
      'payment-subject': 'paymentSubjectPage'
    },

    initialize: function (app) {
      var self = this;
      app.on('change:page', function(m, val) {
        var page = Backbone.history.fragment.split('/')[0];
        if (page !== val) {
          self.navigate(val, {trigger: true});
        }
      });
      this.events = app.get('events');
      this.app = app;
    },

    routePages: function () {
      var path = arguments[0];
      // If it is home page, then args will be null.
      if (!path) {
        path = '';
      }
      var args = path.split('/');
      var page = args.shift();
      if (this.paths[page]) {
        this.app.set('page', page);
        // Clear screen.
        if (this.pageView) {
          this.pageView.remove();
        }
        // Show new content.
        var callback = this.paths[page];
        // TODO: escape arguments from path.
        this[callback].apply(this, args);
      }
    },

    mainPage: function () {
      this.pageView = new EventsPageView({model: this.events});
    },

    addEventPage: function () {
      this.pageView = new AddEventPageView({
        appEvents: this.events
      });
    },

    eventPage: function (eventId) {
      this.pageView = new EventPageView({
        model: this.events.get(eventId)
      });
    },

    addPartnerPage: function (eventId) {
      this.pageView = new AddEventPartnerPageView({
        event: this.events.get(eventId),
        allPartners: this.app.get('partners')
      });
    },

    addPaymentPage: function (eventId, partnerId) {
      var event = this.events.get(eventId);
      this.pageView = new AddPaymentPageView({
        event: event,
        payer: event.get('partners').get(partnerId),
        backPath: 'event/' + eventId
      });
    },

    partnerPage: function (eventId, partnerId) {
      var event = this.events.get(eventId);
      this.pageView = new EventPartnerPageView({
        model: event.get('partners').get(partnerId),
        event: event
      });
    },

    paymentSubjectPage: function (eventId, subjectId, backPath) {
      var event = this.events.get(eventId);
      this.pageView = new PaymentSubjectPageView({
        model: event.get('paymentSubjects').get(subjectId),
        backPath: decodeURIComponent(backPath)
      });
    }
  });
});
