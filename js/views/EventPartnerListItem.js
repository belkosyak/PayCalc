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
        <div class="partner-controls column-3">\n\
          <a href="#pay/<%= eventId %>/<%= id %>"\n\
              class="partner-pay-button button">\n\
            Pay\n\
          </a>\n\
        </div>\n\
      </div>\n\
    '),

    initialize: function (options) {
      this.event = options.event;
    },

    render: function () {
      var balance = Math.round(this.event.getPartnerBalance(this.model));
      this.$el.html(this.template({
        eventId: this.event.get('id'),
        id: this.model.get('id'),
        name: this.model.get('name'),
        balance: balance,
        balanceClass: balance >= 0 ? 'ok' : 'debt'
      }));
      return this;
    }
  });

});
