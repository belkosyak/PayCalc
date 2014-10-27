define(['underscore', 'PageView', 'NameTextFieldView', 'EventPartnerListItem'],
function (_, PageView, NameTextFieldView, EventPartnerListItem) {

  return PageView.extend({
    template: _.template('\n\
      <div class="event-page">\n\
        <div class="page-title"></div>\n\
        <div class="page-controls">\n\
          <a href="#" class="back-button button">Back</a>\n\
          <a href="#add-partner/<%= id %>" class="add-partner-button button">\n\
            Add partner\n\
          </a>\n\
          <div class="delete-event-button button">X</div>\n\
        </div>\n\
        <div class="page-body">\n\
          <!-- Place to render EventPartnerListItem list -->\n\
        </div>\n\
      </div>\n\
    '),
    
    subviews: {
      '.page-title': NameTextFieldView
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
