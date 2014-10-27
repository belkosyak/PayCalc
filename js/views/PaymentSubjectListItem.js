define(['underscore', 'backbone'],
function (_, Backbone) {

  return Backbone.View.extend({
    template: _.template('\n\
      <a href="#payment-subject/<%= eventId %>/<%= subjectId %>/<%= backPath %>"\n\
          class="name column-1">\n\
        <%- name %>\n\
      </a>\n\
      <div class="subject-cost column-2">\n\
        <%- cost %>\n\
      </div>\n\
    '),

    initialize: function (args) {
      this.backPath = args.backPath;
    },

    render: function () {
      var cost = this.model.get('cost');
      if (this.model.get('isLoan')) {
        cost = cost / 2;
      }
      this.$el.html(this.template({
        eventId: this.model.get('event').get('id'),
        subjectId: this.model.get('id'),
        name: this.model.get('name'),
        cost: cost,
        backPath: encodeURI(this.backPath)
      }));
      return this;
    }
  });

});
