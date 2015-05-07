define(['underscore', 'backbone', 'PageView', 'Payment'],
function (_, Backbone, PageView, Payment) {

  return PageView.extend({
    template: _.template('\n\
      <div class="add-sponsor-page">\n\
        <div class="page-title h1">\n\
          Add sponsor for <%= subject.get("name") %>\n\
        </div>\n\
        <div class="page-controls container">\n\
          <a href="#payment-subject/<%= event.get("id") %>/<%= subject.get("id") %>"\n\
              class="btn btn-default">Back</a>\n\
        </div>\n\
        <div class="page-body container">\n\
          <div class="errors"></div>\n\
          <div class="form-group">\n\
            <label for="sponsor_select">Who gives money</label>\n\
            <select id="sponsor_select" class="form-control init-focus">\n\
              <% sponsors.each(function (partner) { %>\n\
                <option value="<%= partner.get("id") %>">\n\
                  <%= partner.get("name") %> (<%= subject.getPartnerBalance(partner) %>)\n\
                </option>\n\
              <% }); %>\n\
            </select>\n\
          </div>\n\
          <div class="form-group">\n\
            <label for="amount">How much</label>\n\
            <input type="text" id="amount" class="form-control" />\n\
          </div>\n\
          <div class="form-group">\n\
            <label for="taker_select">Who takes money</label>\n\
            <select id="taker_select" class="form-control">\n\
              <% takers.each(function (partner) { %>\n\
                <option value="<%= partner.get("id") %>">\n\
                  <%= partner.get("name") %> (<%= subject.getPartnerBalance(partner) %>)\n\
                </option>\n\
              <% }); %>\n\
            </select>\n\
          </div>\n\
          <div class="form-group">\n\
            <input class="add-sponsor-button btn btn-primary btn-block" type="button" value="Add Sponsor" />\n\
          </div>\n\
        </div>\n\
      </div>\n\
    '),

    events: {
      'click .add-sponsor-button': 'addSponsor'
    },

    render: function () {
      var subject = this.model;
      var sponsors = this.model.get('partners').clone();
      var takers = new Backbone.Collection();
      this.model.get('partners').each(function (partner) {
        if (subject.getPartnerBalance(partner) > 0) {
          takers.push(partner);
        }
      });
      this.$el.html(this.template({
        event: this.options.event,
        subject: this.model,
        sponsors: sponsors,
        takers: takers
      }));
      return this;
    },
    
    addSponsor: function () {
      var amount = parseFloat(this.$('#amount').val());
      var subject = this.model;
      var sponsor = subject.get('partners').get(this.$('#sponsor_select').val());
      var taker = subject.get('partners').get(this.$('#taker_select').val());

      var payment = subject.addSponsorPayment(sponsor, taker, amount);

      if (payment instanceof Payment) {
        app.set('page', 'payment-subject/' + this.options.event.get('id') + '/'
            + subject.get('id'));
      }
      else {
        this.showErrors(payment);
      }
    }
  });

});
