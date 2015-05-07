define(['backbone', 'PayCalcModel', 'Partner', 'Payment'],
function (Backbone, PayCalcModel, Partner, Payment) {

  return PayCalcModel.extend({
    defaults: {
      name: '',
      cost: 0,
      event: null,
      partners: null,
      payments: null,
      isLoan: false
    },

    initialize: function (args) {
      var partners = args.partners ? args.partners : new Backbone.Collection();
      this.set('partners', partners);
      var payments = args.payments ? args.payments : new Backbone.Collection();
      var self = this;
      payments.each(function (payment) {
        payment.set('subject', self);
      });
      this.set('payments', payments);

      this.on('destroy', function () {
        var payment;
        while (payment = this.get('payments').first()) {
          payment.destroy();
        }
      });
    },
    
    toJSON: function () {
      var ret = {
        id: this.get('id'),
        name: this.get('name'),
        cost: this.get('cost'),
        isLoan: this.get('isLoan'),
        partners: [],
        payments: []
      };
      this.get('partners').each(function (partner) {
        ret.partners.push(partner.get('id'));
      });
      this.get('payments').each(function (payment) {
        ret.payments.push(payment.get('id'));
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
        errors.push('Payment subject name cannot be empty.');
      }
      if (!Backbone.$.isNumeric(attrs.cost) || attrs.cost <= 0) {
        errors.push('Incorrect payment subject cost.');
      }
      if (!attrs.partners.length) {
        errors.push('Payment subject should has at least one partner.');
      }
      if (errors.length > 0) {
        return errors;
      }
    },

    addPayment: function (payer, amount) {
      var payment = Payment.createModel({
        payer: payer,
        amount: amount,
        subject: this
      });
      if (payment instanceof Payment) {
        this.get('payments').add(payment);
      }
      return payment;
    },

    getPaymentPart: function () {
      return this.get('cost') / this.get('partners').length;
    },

    getPartnerBalance: function (partner) {
      var partners = this.get('partners');
      if (!partners.contains(partner)) {
        return 0;
      }
      var balance = -1 * this.getPaymentPart();
      this.get('payments').each(function (payment) {
        if (payment.get('payer') == partner) {
          balance += payment.get('amount');
        }
      });
      return balance;
    },

    getPartnerPayments: function (partner) {
      var payments = new Backbone.Collection();
      this.get('payments').each(function (payment) {
        if (payment.get('payer') == partner) {
          payments.add(payment);
        }
      });
      return payments;
    },

    /**
     * Returns full partner debt for this payment subject.
     * Creates partner's payment and recrease other payment subject partners
     * payments.
     * @param partner Partner object
     * @return {object} Hash with keys:
     *   - total: Total amount of returned debt.
     *   - parts: Hash of returned parts of debt, keys are user ids and
     *     values are objects with user info and amounts
     *     ({partner: ..., amount: ...}).
     */
    returnPartnerDebt: function (partner) {
      var debtorBalance = this.getPartnerBalance(partner);
      // Partner with positive balance cannot return debt, debt is negative balance.
      if (debtorBalance >= 0) {
        return;
      }
      this.addPayment(partner, -1 * debtorBalance).save();
      this.save();
      var debt = -1 * debtorBalance;

      // Return debt to other partners as possible.
      var self = this;
      var partnerBalance;
      var returnPart;

      var returnedDebtInfo = this.spreadMoney(debt, new Backbone.Collection([partner]));

      if (debt - returnedDebtInfo.total > 0) {
        throw {
          name: "Not full debt has been payed.",
          toString: function () { return this.name; }
        }
      }
      return returnedDebtInfo;
    },

    removePartner: function (partner) {
      $.each(this.get('payments').toArray(), function (i, payment) {
        if (payment.get('payer') == partner) {
          payment.destroy();
        }
      });
      this.get('partners').remove(partner);
      if (this.get('partners').length == 1) {
        this.destroy();
      }
      else {
        this.save();
      }
    },

    /**
     * Decrease payment subject partners payments by passed amount of money.
     * @param amount Amount of money to spread
     * @param excludePartners Backbone collection with partners, who shouldn't
     *   get money.
     * @return {object} Hash with keys:
     *   - total: Total amount of returned debt.
     *   - parts: Hash of returned parts of debt, keys are user ids and
     *     values are objects with user info and amounts
     *     ({partner: ..., amount: ...}).
     */
    spreadMoney: function (amount, excludePartners) {
      var spreadedInfo = {
        total: 0,
        parts: {}
      };
      var self = this;

      this.get('partners').each(function (partner) {
        partnerBalance = self.getPartnerBalance(partner);
        if (partnerBalance <= 0) {
          return;
        }
        self.getPartnerPayments(partner).each(function (payment) {
          returnPart = Math.min(payment.get('amount'), amount);
          amount -= returnPart;
          payment.set('amount', payment.get('amount') - returnPart);
          payment.save();

          // Fill array with returned parts info.
          if (spreadedInfo.parts[partner.get('id')]) {
            spreadedInfo.parts[partner.get('id')].amount += returnPart;
          }
          else {
            spreadedInfo.parts[partner.get('id')] = {
              partner: partner,
              amount: returnPart
            };
          }
          spreadedInfo.total += returnPart;
        });
      });
      return spreadedInfo;
    },
    
  });
});
