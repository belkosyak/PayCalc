define(['underscore', 'backbone'],
function (_, Backbone) {

  return Backbone.View.extend({
    template: _.template('\n\
      <div class="partner three-column-list-item">\n\
        <a href="#partner/<%= eventId %>/<%= id %>" class="name column-1">\n\
            <%- name %>\n\
        </a>\n\
        <div class="partner-balance column-2 <%= balanceClass %>">\n\
          <%- balance %>\n\
        </div>\n\
        <% if (balance < 0) { %>\n\
          <div class="partner-controls column-3">\n\
            <a class="return-debt-button button">Return</a>\n\
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
