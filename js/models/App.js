define(['backbone', 'Event', 'Subject', 'Partner', 'Payment'],
function (Backbone, Event, PaymentSubject, Partner, Payment) {
  return Backbone.Model.extend({
    defaults: {
      page: '',
      events: null,
      partners: null,
      payments: null
    },

    initialize: function() {
      this.set('events', new Backbone.Collection());
      this.set('partners', new Backbone.Collection());
      this.set('paymentSubjects', new Backbone.Collection());
    },

    initModels: function(data) {
      var self = this;
      if (!data['Event'])
        return;

      var allPartners = self.get('partners');
      var allPaymentSubjects = self.get('paymentSubjects');
      var allPayments = new Backbone.Collection();

      if (data['Partner']) {
        Backbone.$.each(data['Partner'], function(index, modelData) {
          allPartners.add(new Partner(modelData));
        });
      }
      if (data['Payment']) {
        Backbone.$.each(data['Payment'], function(index, modelData) {
          modelData.payer = allPartners.get(modelData.payer);
          allPayments.add(new Payment(modelData));
        });
      }
      var partnerList, paymentList, paymentSubjectList;
      if (data['PaymentSubject']) {
        Backbone.$.each(data['PaymentSubject'], function(index, modelData) {
          partnerList = new Backbone.Collection();
          paymentList = new Backbone.Collection();
          Backbone.$.each(modelData.partners, function(i, partnerID) {
            partnerList.add(allPartners.get(partnerID));
          });
          modelData.partners = partnerList;
          Backbone.$.each(modelData.payments, function(i, paymentID) {
            paymentList.add(allPayments.get(paymentID));
          });
          modelData.payments = paymentList;
          allPaymentSubjects.add(new PaymentSubject(modelData));
        });
      }
      Backbone.$.each(data['Event'], function(index, modelData) {
        partnerList = new Backbone.Collection();
        paymentSubjectList = new Backbone.Collection();

        Backbone.$.each(modelData.partners, function(i, partnerID) {
          partnerList.add(allPartners.get(partnerID));
        });
        modelData.partners = partnerList;
        Backbone.$.each(modelData.paymentSubjects, function(i, subjectID) {
          paymentSubjectList.add(allPaymentSubjects.get(subjectID));
        });
        modelData.paymentSubjects = paymentSubjectList;
        self.get('events').add(new Event(modelData));
      });
    },

    addModel: function (model) {
      if (model instanceof Event) {
        this.get('events').add(model);
      }
      else if (model instanceof Partner) {
        this.get('partners').add(model);
      }
      else if (model instanceof PaymentSubject) {
        this.get('paymentSubjects').add(model);
      }
    }
  });
});

