define(['underscore', 'backbone', 'PaymentSubjectListItem'],
function (_, Backbone, PaymentSubjectListItem) {

  return Backbone.View.extend({
    template: _.template('\n\
      <div class="partner-payment-subject contaner clearfix">\n\
        <div class="partner-payment-subject-balance col-xs-3 text-center <%= balanceClass %>">\n\
          <%- balance %>\n\
        </div>\n\
      </div>\n\
    '),

    initialize: function (args) {
      this.partner = args.partner;
      this.backPath = args.backPath
    },

    render: function () {
      var balance = Math.round(this.model.getPartnerBalance(this.partner));
      this.$el.html(this.template({
        balance: balance,
        balanceClass: balance >= 0 ? 'ok' : 'debt'
      }));
      this.$('.partner-payment-subject').prepend(
        new PaymentSubjectListItem({
          model: this.model,
          backPath: this.backPath
        }).render().$el
      );
      return this;
    }
  });

});
