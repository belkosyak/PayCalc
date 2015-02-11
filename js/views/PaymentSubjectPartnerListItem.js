define(['underscore', 'backbone'],
function (_, Backbone) {

  return Backbone.View.extend({
    template: _.template('\n\
      <div class="partner container">\n\
        <a href="#partner/<%= eventId %>/<%= id %>"\n\
            class="name btn btn-info col-xs-6">\n\
          <%- name %>\n\
        </a>\n\
        <div class="partner-balance text-center col-xs-3 <%= balanceClass %>">\n\
          <%- balance %>\n\
        </div>\n\
        <% if (balance < 0) { %>\n\
          <div class="partner-controls col-xs-3 no-padding">\n\
            <a class="return-debt-button btn btn-primary btn-block">Return</a>\n\
          </div>\n\
        <% } %>\n\
      </div>\n\
    '),

    initialize: function (options) {
      this.subject = options.subject;
    },

    events: {
      'click .return-debt-button': 'returnDebt'
    },

    render: function () {
      var balance = Math.round(this.subject.getPartnerBalance(this.model));
      this.$el.html(this.template({
        eventId: this.subject.get('event').get('id'),
        id: this.model.get('id'),
        name: this.model.get('name'),
        balance: balance,
        balanceClass: balance >= 0 ? 'ok' : 'debt'
      }));
      return this;
    },

    returnDebt: function () {
      if (confirm('Are you sure?')) {
        this.subject.returnPartnerDebt(this.model);
        Backbone.history.loadUrl(Backbone.history.fragment);
      }
    }
  });

});
