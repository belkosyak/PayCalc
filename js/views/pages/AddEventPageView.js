define(['underscore', 'PageView', 'Event', 'Partner'],
function (_, PageView, Event, Partner) {

  return PageView.extend({
    template: _.template('\n\
      <div class="add-page add-event-page">\n\
        <div class="page-title">\n\
          Enter event name\n\
        </div>\n\
        <div class="page-controls">\n\
          <a href="#">\n\
            <div class="back-button button">Back</div>\n\
          </a>\n\
        </div>\n\
        <div class="page-body">\n\
          <div class="errors"></div>\n\
          <input type="text" placeholder="Name"/>\n\
          <input class="button add-event-button" type="button" value="Add" />\n\
        </div>\n\
      </div>\n\
    '),

    events: {
      'click .add-event-button': 'addEvent'
    },

    render: function () {
      this.$el.html(this.template());
      return this;
    },
    
    addEvent: function () {
      var name = this.$el.find('input:text').val();
      var errors = [];
      var event = Event.createModel({name: name});

      if (event instanceof Event) {
        event.save();
        this.options.appEvents.add(event);
        app.set('page', 'event/' + event.get('id'));
      }
      else {
        this.showErrors(event);
      }
    },

    showErrors: function (errors) {
      var errorsWrapper = this.$el.find('.errors').empty();
      _.each(errors, function (errorString) {
        errorsWrapper.append(errorString);
      });
    }
  });

});
