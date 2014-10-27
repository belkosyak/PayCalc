define(['underscore', 'backbone'],
function (_, Backbone) {

  // View to render textfield, which represents some model 'name' property.
  return Backbone.View.extend({
    template: _.template('<input type="text" class="name-field" value="<%- name %>"/>'),

    events: {
      'change input': 'changeName'
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
        name: this.model.get('name')
      }));
      return this;
    },

    dropValue: function() {
      this.$el.find('input').val(this.model.get('name'));
    }
  });

});
