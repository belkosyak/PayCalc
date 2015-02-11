define(['underscore', 'PageView'],
function (_, PageView) {

  return PageView.extend({
    template: _.template('\n\
      <div class="main-page">\n\
        <div class="page-title h1">Choose event</div>\n\
        <div class="page-controls container">\n\
          <a href="#add-event" class="btn btn-primary btn-block">\n\
            Add event\n\
          </a>\n\
        </div>\n\
        <div class="page-body container">\n\
          <div class="btn-group-vertical center-block" role="group">\n\
            <% events.each(function (event) { %>\n\
              <a class="btn btn-default btn-block" href="#event/<%= event.get("id") %>">\n\
                <%- event.get("name") %>\n\
              </a>\n\
            <% });	%>\n\
          </div>\n\
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
