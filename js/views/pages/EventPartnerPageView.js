define(['underscore', 'PageView', 'NameTextFieldView', 'PartnerPaymentSubjectListItem'],
function (_, PageView, NameTextFieldView, PartnerPaymentSubjectListItem) {

  return PageView.extend({
    template: _.template('\n\
      <div class="event-partner-page">\n\
        <div class="page-title h1 container"></div>\n\
        <div class="page-controls container">\n\
          <a href="#event/<%= eventId %>" class="btn btn-default">Event page</a>\n\
          <div class="delete-partner-button btn btn-danger pull-right">X</div>\n\
        </div>\n\
        <div class="h4 balance container <%= balanceClass %>">\n\
          Total balance: <%- balance %>\n\
        </div>\n\
        <div class="page-body payment-list container">\n\
          <!-- Place to render payment subject list -->\n\
        </div>\n\
      </div>\n\
    '),

    events: {
      'click .delete-partner-button': 'deletePartner'
    },

    subviews: {
      '.page-title': NameTextFieldView
    },

    render: function() {
      var event = this.options.event;
      var balance = Math.round(event.getPartnerBalance(this.model));
      this.$el.html(this.template({
        balance: balance,
        balanceClass: balance >= 0 ? 'ok' : 'debt',
        eventId: event.get('id')
      }));

      var self = this;
      var subjectView;
      event.get('paymentSubjects').each(function(subject) {
        if (subject.get('partners').contains(self.model)) {
          subjectView = new PartnerPaymentSubjectListItem({
            model: subject,
            partner: self.model,
            backPath: encodeURIComponent(Backbone.history.fragment)
          });
          self.$('.page-body').append(subjectView.render().$el);
        }
      });
      return this;
    },

    deletePartner: function() {
      if (confirm('Are you sure?')) {
        var event = this.options.event;
        event.removePartner(this.model);
        app.set('page', 'event/' + event.get('id'));
      }
    }
  });

});
