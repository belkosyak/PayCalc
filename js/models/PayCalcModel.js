define(['backbone'],
function (Backbone) {

  // Basic model for all other models.
  return Backbone.$.extend(Backbone.Model, {

    /**
    * Creates instance of model by simple object.
    *
    * If instance of this.prototype is passed, then the same object will be
    * returned. If simple object is passed, then new this.prototype object will
    * be created with validation.
    * @param obj - simple object or instance of PayCalcModel.
    * @returns Instance of PayCalcModel or array with error strings.
    */
    createModel: function(obj) {
      var constructor = this.prototype.constructor;
      if (!(obj instanceof constructor)) {
        obj = new constructor(obj, {validate: true});
        if (obj.validationError !== null) {
          return obj.validationError;
        }
      }
      return obj;
    }
  });
});
