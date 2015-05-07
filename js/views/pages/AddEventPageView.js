define(['underscore', 'PageView', 'Event', 'Partner'],
function (_, PageView, Event, Partner) {

  return PageView.extend({
    template: _.template('\n\
      <div class="add-page">\n\
        <div class="page-title h1">\n\
          Enter event name\n\
        </div>\n\
        <div class="page-controls container">\n\
          <a href="#" class="btn btn-default">Back</a>\n\
        </div>\n\
        <div class="page-body container">\n\
          <div class="errors"></div>\n\
          <div class="form-group">\n\
            <input type="text" placeholder="Name" class="form-control init-focus" />\n\
          </div>\n\
          <div class="form-group">\n\
            <input class="add-event-button btn btn-primary btn-block" type="button" value="Add" />\n\
          </div>\n\
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
    }
  });

});
