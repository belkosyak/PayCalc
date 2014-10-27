define(['underscore', 'backbone', 'PageView', 'Payment', 'Partner', 'Subject'],
function (_, Backbone, PageView, Payment, Partner, PaymentSubject) {

  return PageView.extend({
    template: _.template('\n\
      <div class="add-payment-page">\n\
        <div class="page-title">Add payment</div>\n\
        <div class="page-controls">\n\
          <a href="#<%= backPath %>">\n\
            <div class="back-button button">Back</div>\n\
          </a>\n\
        </div>\n\
        <div class="page-body">\n\
          <div class="errors"></div>\n\
          <label for="cost">How much</label>\n\
          <input type="text" id="cost" />\n\
          <div class="name-loan-wrap clearfix">\n\
            <div class="subject-name">\n\
              <label for="name">Subject</label>\n\
              <input type="text" id="name"/>\n\
            </div>\n\
            <div class="subject-is-loan">\n\
              <label for="is_loan">Is Loan</label>\n\
              <input type="checkbox" id="is_loan" />\n\
            </div>\n\
          </div>\n\
          <div class="select-all-wrap">\n\
            <div id="select_all_partners" class="button">Select all</div>\n\
          </div>\n\
          <div class="payment-partner-list">\n\
            <% partners.each(function (partner) { %>\n\
              <div class="partner-wrap">\n\
                <label for="partner-checkbox-<%= partner.get("id") %>">\n\
                  <%- partner.get("name") %>\n\
                </label>\n\
                <input type="checkbox"\n\
                  id="partner-checkbox-<%= partner.get("id") %>"\n\
                  data-id="<%= partner.get("id") %>"\n\
                  <% if (partner == payer) { %>\n\
                    disabled="disabled" checked\n\
                  <% }  %>\n\
                >\n\
              </div>\n\
            <% });	%>\n\
          </div>\n\
          <input type="button" value="OK" class="add-payment-button button" />\n\
        </div>\n\
      </div>\n\
    '),

    events: {
      'click .add-payment-button':  'addPayment',
      'click #select_all_partners': 'checkAllPartners'
    },

    render: function () {
      var partners = this.options.event.get('partners');
      this.$el.html(this.template({
        eventId: this.options.eventId,
        partners: this.options.event.get('partners'),
        backPath: this.options.backPath,
        payer: this.options.payer
      }));
      return this;
    },

    addPayment: function () {
      var paymentPartners = new Backbone.Collection();
      var event = this.options.event;
      var partners = event.get('partners');
      var errors;
      // Collect all checked partners.
      this.$('input:checkbox').each(function () {
        if ($(this).prop('checked')) {
          paymentPartners.push(partners.get($(this).data('id')));
        }
      });
      var name = this.$('#name').val();
      var cost = parseFloat(this.$('#cost').val());
      var isLoan = this.$('#is_loan').prop('checked');

      if (isLoan && paymentPartners.length > 2) {
        errors = ['You can lend only one person.'];
      }
      else {
        name = this.generateName(name, cost, isLoan, paymentPartners);
        var paymentSubject = event.addPaymentSubject(name, cost, isLoan, paymentPartners);
        if (!(paymentSubject instanceof PaymentSubject)) {
          errors = paymentSubject;
        }
        else {
          var payment = paymentSubject.addPayment(
            this.options.payer,
            cost
          );
          if (!(payment instanceof Payment)) {
            errors = payment;
          }
          else {
            payment.save();
            paymentSubject.save();
            event.save();
            app.set('page', this.options.backPath);
          }
        }
      }
      var self = this;
      _.each(errors, function (errorString) {
        self.$('.errors').empty().append(errorString);
      });
      return;
    },

    checkAllPartners: function () {
      this.$el.find('.payment-partner-list input:checkbox').prop('checked', true);
    },

    generateName: function (name, cost, isLoan, paymentPartners) {
      var self = this;
      name = $.trim(name);
      var generatedName = name;
      if (isLoan) {
        generatedName = this.options.payer.get('name') + " lent ";
        var partnerNames = [];
        paymentPartners.each(function (partner) {
          if (partner != self.options.payer) {
            partnerNames.push(partner.get('name'));  
          }
        });
        generatedName += partnerNames.join(', ');
        if (name) {
          generatedName += "(" + name + ")";
        }
      }
      else if (!name) {
        generatedName = cost;
      }
      return generatedName;
    }

  });
});
