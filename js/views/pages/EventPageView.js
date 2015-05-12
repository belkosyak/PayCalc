define(['underscore', 'PageView', 'NameTextFieldView', 'EventPartnerListItem'],
function (_, PageView, NameTextFieldView, EventPartnerListItem) {

  return PageView.extend({
    template: _.template('\n\
      <div class="event-page">\n\
        <div class="page-title container"></div>\n\
        <div class="page-controls container">\n\
          <a href="#" class="btn btn-default">Back</a>\n\
          <a href="#add-partner/<%= id %>" class="btn btn-default">\n\
            Add partner\n\
          </a>\n\
          <div class="delete-event-button btn btn-danger pull-right">X</div>\n\
        </div>\n\
        <div class="page-body partner-list">\n\
          <!-- Place to render EventPartnerListItem list -->\n\
        </div>\n\
      </div>\n\
    '),
    
    subviews: {
      '.page-title': {
        view: NameTextFieldView,
        options: {
          label: "Event"
        }
      }
    },

    events: {
      'click .delete-event-button': 'deleteEvent'
    },

    render: function () {
      // this.model is an instance of $.Event.
      this.$el.html(this.template({
        id: this.model.get('id')
      }));

      var partnerView = null;
      var self = this;
      this.model.get('partners').each(function (partner, index) {
        partnerView = new EventPartnerListItem({
          model: partner,
          event: self.model
        });
        self.$('.page-body').append(partnerView.render().$el);
      });
      return this;
    },

    deleteEvent: function () {
      if (confirm('Are you sure?')) {
        this.model.destroy();
        app.set('page', '');
      }
    }
  });

});
