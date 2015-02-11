define(['underscore', 'backbone'],
function (_, Backbone) {

  return Backbone.View.extend({
    template: _.template('\n\
      <div class="partner container">\n\
        <a href="#partner/<%= eventId %>/<%= id %>"\n\
            class="name btn btn-info btn-sm col-xs-6">\n\
          <%- name %>\n\
        </a>\n\
        <div class="partner-balance text-center input-sm col-xs-3 <%= balanceClass %>">\n\
          <%- balance %>\n\
        </div>\n\
        <div class="partner-controls col-xs-3 no-padding">\n\
          <a href="#pay/<%= eventId %>/<%= id %>"\n\
              class="partner-pay-button btn btn-primary btn-sm btn-block">\n\
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
