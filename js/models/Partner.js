define(['backbone', 'PayCalcModel', 'Payment'],
function (Backbone, PayCalcModel, Payment) {

  return PayCalcModel.extend({
    defaults: {
      name: ''
    },

    /**
     * Model validation function.
     * @returns If errors has been detected, then returns array with error strings.
     */
    validate: function(attrs, options) {
      if (Backbone.$.trim(attrs.name) == '') {
        return ['Partner name cannot be empty.'];
      }
    },
  });
});
