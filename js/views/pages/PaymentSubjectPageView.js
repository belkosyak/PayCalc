define(['underscore', 'PageView', 'NameTextFieldView', 'PaymentSubjectPartnerListItem'],
function (_, PageView, NameTextFieldView, PaymentSubjectPartnerListItem) {

  return PageView.extend({
    template: _.template('\n\
      <div class="payment-subject-page">\n\
        <div class="page-title container"></div>\n\
        <div class="page-controls container">\n\
          <a href="#<%= backPath %>" class="btn btn-default">Back</a>\n\
          <a href="#add-sponsor/<%= eventId %>/<%= subjectId %>"\n\
              class="add-sponsor btn btn-default">Add Sponsor</a>\n\
          <div class="delete-subject-button btn btn-danger pull-right">X</div>\n\
        </div>\n\
        <div class="h4 container">\n\
          Cost: <%- cost %>\n\
        </div>\n\
        <div class="page-body partner-list">\n\
          <!-- Place to render partner list -->\n\
        </div>\n\
      </div>\n\
    '),

    events: {
      'click .delete-subject-button': 'deleteSubject'
    },

    subviews: {
      '.page-title': {
        view: NameTextFieldView,
        options: {
          label: "Payment"
        }
      }
    },

    render: function () {
      var cost = this.model.get('cost');
      if (this.model.get('isLoan')) {
        cost = cost / 2;
      }
      this.$el.html(this.template({
        subjectId: this.model.get('id'), 
        eventId: this.options.event.get('id'),
        cost: cost,
        backPath: this.options.backPath
      }));

      var self = this;
      var partnerView;
      this.model.get('partners').each(function (partner) {
        partnerView = new PaymentSubjectPartnerListItem({
          model: partner,
          subject: self.model
        });
        self.$('.page-body').append(partnerView.render().$el);
      });
      return this;
    },

    deleteSubject: function () {
      if (confirm('Are you sure?')) {
        this.model.destroy();
        app.set('page', this.options.backPath);
      }
    }
  });

});
