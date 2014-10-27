define(['backbone', 'PayCalcModel', 'Partner'],
function (Backbone, PayCalcModel, Partner) {

  return PayCalcModel.extend({
    defaults: {
      amount: 0,
      payer: null,
      subject: null
    },

    toJSON: function() {
      var ret = {
        id: this.get('id'),
        amount: this.get('amount'),
        payer: this.get('payer').get('id')
      };
      return ret;
    },

    /**
     * Model validation function.
     * @returns If errors has been detected, then returns array with error strings.
     */
    validate: function(attrs, options) {
      var errors = [];
      if (!Backbone.$.isNumeric(attrs.amount) || attrs.amount < 0) {
        errors.push('Incorrent payment amount.');
      }
      if (!attrs.payer) {
        errors.push('Payment must has payer.');
      }
      if (!attrs.subject) {
        errors.push('Payment must relate to subject.');
      }
      if (errors.length > 0) {
        return errors;
      }
    }
  });
});
