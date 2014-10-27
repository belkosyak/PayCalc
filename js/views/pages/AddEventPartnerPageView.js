define(['underscore', 'PageView', 'Event', 'Partner'],
function (_, PageView, Event, Partner) {

  return PageView.extend({
    template: _.template('\n\
      <div class="add-page add-event-partner-page">\n\
        <div class="page-title">\n\
          Add partner\n\
        </div>\n\
        <div class="page-controls">\n\
          <a href="#event/<%= eventId %>">\n\
            <div class="back-button button">Back</div>\n\
          </a>\n\
        </div>\n\
        <div class="page-body">\n\
          <div class="errors"></div>\n\
          <label for="partners_select">Choose</label>\n\
          <select id="partners_select">\n\
            <%= partnerOptions %>\n\
          </select>\n\
          <label for="name">or Type in name</label>\n\
          <input type="text" id="name" placeholder="Name"/>\n\
          <input class="button add-partner-button" type="button" value="Add" />\n\
        </div>\n\
      </div>\n\
    '),

    events: {
      'click .add-partner-button': 'addPartner'
    },

    render: function () {
      this.$el.html(this.template({
        eventId: this.options.event.get('id'),
        partnerOptions: this.generatePartnerOptions()
      }));
      this.bindControls();
      return this;
    },
    
    addPartner: function () {
      var errors = [];
      var nameText = $.trim(this.$el.find('input:text').val());
      var selectVal = this.$el.find('select').val();
      var partner;
      if (nameText) {
        if (this.options.allPartners.findWhere({name: nameText})) {
          partner = ['Such partner already exists'];
        }
        else {
          partner = Partner.createModel({name: nameText});
        }
      }
      else {
        if (selectVal) {
          partner = this.options.allPartners.get(selectVal);
        }
        else {
          partner = ['Do something!'];
        }
      }
      if (partner instanceof Partner) {
        var event = this.options.event;
        partner.save();
        event.get('partners').add(partner);
        event.save();
        app.set('page', 'event/' + event.get('id'));
      }
      else {
        this.showErrors(partner);
      }
    },

    showErrors: function (errors) {
      var errorsWrapper = this.$el.find('.errors').empty();
      _.each(errors, function (errorString) {
        errorsWrapper.append(errorString);
      });
    },

    generatePartnerOptions: function () {
      var options = '<option value="">None</option>';
      var eventPartners = this.options.event.get('partners');
      this.options.allPartners.each(function (partner) {
        if (!eventPartners.get(partner)) {
          options += '<option value="' + partner.get('id') + '">' +
                        partner.get('name') +
                      '</option>';
        }
      });
      return options;
    },

    bindControls: function () {
      var self = this;
      var select = this.$el.find('select');
      var textbox = this.$el.find('#name');
      select.change(function () {
        textbox.val('');
      });

      textbox.keydown(function () {
        select.val('');
      });
    }
  });

});
