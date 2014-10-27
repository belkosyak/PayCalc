define(['underscore', 'PageView'],
function (_, PageView) {

  return PageView.extend({
    template: _.template('\n\
      <div class="main-page">\n\
        <div class="page-title">Choose event</div>\n\
        <div class="page-controls">\n\
          <a href="#add-event" class="add-event-button button">\n\
            Add event\n\
          </a>\n\
        </div>\n\
        <div class="page-body">\n\
          <% events.each(function (event) { %>\n\
            <a class="event" href="#event/<%= event.get("id") %>">\n\
              <%- event.get("name") %>\n\
            </a>\n\
          <% });	%>\n\
        </div>\n\
      </div>\n\
    '),

    render: function () {
      // this.model is an instance of collection of $.Event instances.
      this.$el.html(this.template({
        events: this.model
      }));
      return this;
    }
  });

});
