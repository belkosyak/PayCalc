define(['underscore', 'backbone'],
function (_, Backbone) {

  return Backbone.View.extend({
    initialize: function(options) {
      this.options = options;
      this.render().$el.appendTo('#page');

      // this.subviews is a map of CSS selectors to Subviews
      // the Subview will be initialized in the element that will be queried
      // with the respective selector
      // @example
      // {
      //   '.some-sub-view' : SomeSubView,
      //   '.another-container' : AnotherSubView
      // }
      var self = this;
      if (this.subviews) {
        _.each(this.subviews, function (subview, selector) {
          this.$(selector).append(
            new subview({model: self.model}).render().$el
          );
        });
      }
      _.defer(function () {
        self.$el.find('.init-focus').focus();  
      });
    },

    showErrors: function (errors) {
      var errorsWrapper = this.$el.find('.errors').empty();
      _.each(errors, function (errorString) {
        errorsWrapper.append(errorString);
      });
    }

  });

});
