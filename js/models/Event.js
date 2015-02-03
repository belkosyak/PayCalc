define(['backbone', 'PayCalcModel', 'Subject', 'Partner', 'Payment'],
function (Backbone, PayCalcModel, PaymentSubject, Partner, Payment) {

  return PayCalcModel.extend({
    defaults: {
      name: '',
      partners: null,
      paymentSubjects: null
    },

    initialize: function (args) {
      var partners = args.partners ? args.partners : new Backbone.Collection();
      partners.comparator = 'name';
      partners.sort();
      partners.on('change:name', function () {
        partners.sort();
      });
      this.set('partners', partners);

      var paymentSubjects = args.paymentSubjects ? args.paymentSubjects
          : new Backbone.Collection();
      var self = this;
      paymentSubjects.each(function (subject) {
        subject.set('event', self);
      });
      this.set('paymentSubjects', paymentSubjects);

      this.on('destroy', function () {
        var paymentSubject;
        while (paymentSubject = this.get('paymentSubjects').first()) {
          paymentSubject.destroy();
        }
      });
    },

    toJSON: function () {
      var ret = {
        id: this.get('id'),
        name: this.get('name'),
        partners: [],
        paymentSubjects: []
      };
      this.get('partners').each(function(partner) {
        ret.partners.push(partner.get('id'));
      });
      this.get('paymentSubjects').each(function(subject) {
        ret.paymentSubjects.push(subject.get('id'));
      });
      return ret;
    },

    /**
     * Model validation function.
     * @returns If errors has been detected, then returns array with error strings.
     */
    validate: function (attrs, options) {
      var errors = [];
      if (Backbone.$.trim(attrs.name) == '') {
        errors.push('Event name cannot be empty.');
        return errors;
      }
    },

    addPartner: function (partner) {
      partner = Partner.createModel(partner);
      // If error strings were returned.
      if (!(partner instanceof Partner)) {
        return partner;
      }
      return this.get('partners').addPartner(partner);
    },

    removePartner: function (partner) {
      $.each(this.get('paymentSubjects').toArray(), function (i, subject) {
        subject.removePartner(partner);
      });
      this.get('partners').remove(partner);
      this.save();
    },

    addPaymentSubject: function (name, cost, isLoan, partners) {
      // If payer lend people, then total cost of payment subject should be
      // multiplied by two to simulate loan.
      if (isLoan) {
        cost = cost * 2;
      }
      var paymentSubject = PaymentSubject.createModel({
        name: name,
        cost: cost,
        isLoan: isLoan,
        event: this,
        partners: partners
      });
      if (paymentSubject instanceof PaymentSubject) {
        this.get('paymentSubjects').add(paymentSubject);
      }
      return paymentSubject;
    },

    /**
     * Gets event partner balance.
     * @param partner - Instance of Partner.
     * @returns Partner balance, or false if such partner cannot be find in event.
     */
    getPartnerBalance: function (partner) {
      var paymentPartners = null;
      var balance = 0;
      this.get('paymentSubjects').each(function (subject) {
        balance += subject.getPartnerBalance(partner);
      });
      return balance;
    },
    
    /**
     * Gets event total balance.
     * @returns Number, event total balance.
     */
    getBalance: function () {
      var balance = 0;
      var self = this;
      this.get('partners').each(function (partner) {
        balance += self.getPartnerEventBalance(partner);
      });
      return balance;
    }
  });

});
