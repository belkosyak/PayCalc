define(['underscore', 'backbone', 'PageView', 'Payment', 'Partner', 'Subject'],
function (_, Backbone, PageView, Payment, Partner, PaymentSubject) {

  return PageView.extend({
    template: _.template('\n\
      <div class="add-payment-page">\n\
        <div class="page-title h1">Add payment</div>\n\
        <div class="page-controls container">\n\
          <a href="#<%= backPath %>" class="btn btn-default">Back</a>\n\
        </div>\n\
        <div class="page-body container">\n\
          <div class="errors"></div>\n\
          <div class="form-horizontal">\n\
            <div class="form-group">\n\
              <label for="cost" class="col-xs-3 control-label">How much</label>\n\
              <div class="col-xs-9">\n\
                <input type="text" id="cost" class="form-control" />\n\
              </div>\n\
            </div>\n\
            <div class="form-group">\n\
              <label for="name" class="col-xs-3 control-label">Subject</label>\n\
              <div class="col-xs-9">\n\
                <input type="text" id="name" class="form-control"/>\n\
              </div>\n\
            </div>\n\
            <div class="form-group">\n\
              <div class="col-xs-offset-3 col-xs-9">\n\
                <div class="checkbox">\n\
                  <label>\n\
                    <input type="checkbox" id="is_loan" />\n\
                    Is Loan</label>\n\
                  </label>\n\
                </div>\n\
              </div>\n\
            </div>\n\
          </div>\n\
          <div class="form-group">\n\
            <label>Choose partners to pay for</label>\n\
            <div class="form-group">\n\
              <div id="select_all_partners"\n\
                  class="btn btn btn-success btn-sm">\n\
                Select all partners\n\
              </div>\n\
            </div>\n\
            <div class="payment-partner-list">\n\
              <% partners.each(function (partner) { %>\n\
                <label class="checkbox-inline">\n\
                  <input type="checkbox" data-id="<%= partner.get("id") %>"\n\
                    <% if (partner == payer) { %>\n\
                      disabled="disabled" checked\n\
                    <% } %>\n\
                  >\n\
                  <%- partner.get("name") %>\n\
                </label>\n\
              <% });	%>\n\
            </div>\n\
          </div>\n\
          <div class="form-group">\n\
            <input type="button" value="OK" class="add-payment-button btn btn-primary btn-block" />\n\
          </div>\n\
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
            // If it is loan, then payment subject has cost, multiplied by 2,
            // and payment should have same cost, because all calculation should lead to 0.
            isLoan ? cost * 2 : cost
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
