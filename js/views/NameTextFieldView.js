define(['underscore', 'backbone'],
function (_, Backbone) {

  // View to render textfield, which represents some model 'name' property.
  return Backbone.View.extend({    
    template: _.template([
      '<div class="form-horizontal m-t-10">',
        '<div class="form-group">',
          '<% if (label) { %>',
            '<label for="name_input" class="col-xs-3 control-label m-t-10">',
              '<%= label %>',
            '</label>',
            '<div class="col-xs-9">',
              '<input type="text" class="form-control"',
                  ' id="name_input" value="<%- name %>"/>',
            '</div>',
          '<% } else { %>',
            '<div class="col-xs-12">',
              '<input type="text" class="form-control"',
                  ' id="name_input" value="<%- name %>"/>',
            '</div>',
          '<% } %>',
        '</div>',
      '</div>'
    ].join('')),

    events: {
      'change input': 'changeName'
    },

    initialize: function (options) {
      this.options = options;
    },

    changeName: function() {
      this.model.set('name', this.$el.find('input').val(), {validate: true});
      if (this.model.validationError !== null) {
        alert(this.model.validationError.join(' '));
        this.dropValue();
      }
      else {
        this.model.save();
      }
    },

    render: function() {
      this.$el.html(this.template({
        name: this.model.get('name'),
        label: this.options.label || null
      }));
      return this;
    },

    dropValue: function() {
      this.$el.find('input').val(this.model.get('name'));
    }
  });

});
