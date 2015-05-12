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
      // Also subview can be represented by object with keys 'view' and 'options'
      // to provide options to subview
      // @example
      // {
      //   '.some-sub-view' : {
      //     view: SomeSubView,
      //     options: {
      //       opt1: val1,
      //       opt2: val2
      //     }
      //   }
      // }
      var self = this;
      if (this.subviews) {
        _.each(this.subviews, function (subview, selector) {
          if (typeof subview === 'object') {
            var viewInst = new subview.view(_.extend({
              model: self.model
            }, subview.options || {}));
          }
          else {
            var viewInst = new subview({model: self.model});
          }
          this.$(selector).append(
            viewInst.render().$el
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
