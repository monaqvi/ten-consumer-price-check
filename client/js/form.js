$(function() {
  var submitted = false;
  (function contactButtons() {
    $('#speak_with_add_contact').click(function() {
      var add = $('#templates > #contact > div').clone();
      $('#contacts').append(add);
      $('#speak_with_remove_contact').show()
    });

    $('#speak_with_remove_contact').click(function() {
      var numFields = $('#contacts > .query-group').length;
      if(numFields > 1) $('#contacts > .query-group:last-of-type').remove();
      if(numFields === 2) $('#speak_with_remove_contact').hide();
    });
  })();

  (function removeTooltips() {
    var queryGroups = $('.query-group');
    
    var first = $(queryGroups[0]),
        second = $(queryGroups[1]);

    first.change(function() {
      toggleTooltip.call(this);
    });

    first.keypress(function() {
      toggleTooltip.call(this);
    });

    function toggleTooltip() {
      var self = $(this);
      var valid = !self.find('input:invalid, select:invalid, textarea:invalid').length;
      var tooltip = $(self.find('.tooltip'));
      valid ? tooltip.hide(50) : tooltip.show(50);
    }
  })();

  $('#submit').click(function() {
    var invalid = $('form fieldset[required] input:invalid, form fieldset[required] select:invalid, form fieldset[required] textarea:invalid');
    var checkboxes = $('#criteria input[type="checkbox"]:checked');

    $('.invalid').removeClass('invalid');
    $('#invalid').removeAttr('id');

    if (invalid.length !== 0) {
      $(invalid).parent().addClass('invalid');
      // Important to add to parent to not overwrite individual field ids
      $(invalid[0]).parent().attr('id', 'invalid');
    }

    if (checkboxes.length === 0) {
      var criteria = $('#criteria > fieldset');
      criteria.addClass('invalid');
      criteria.attr('id', 'invalid');
    }

    if(!invalid.length && checkboxes.length && !submitted) {
      submitted = true;
      var singleResponses = $('form fieldset input:valid, form fieldset select:valid, form fieldset textarea:valid')
                                              .not('#criteria input')
                                              .not('#contacts input')
                                              .toArray()
                                              .reduce(nameToValue, {});

      var criterion = $('#criteria input:checked').toArray().map(function(e, i) { 
        return { request_someone_criteria_num: i, request_someone_criteria: e.name }; 
      });

      var contacts = _.chunk($('#contacts input'), 2)
                      .filter(function(e) {
                        return e[0].value || e[1].value;
                      })
                      .map(function(e, i) {
                        return Object.assign({ request_someone_specific_num: i }, e.reduce(nameToValue, {}));
                      });

      contacts = !!contacts.length ? contacts : [ {} ];

      var rows = criterion
                  .map(function(criteria) { return contacts.map(function(contact) { return Object.assign({}, criteria, contact); }); })
                  .map(function(combined) { return combined.map(function(e) { return Object.assign({ source: window.location.pathname }, e, singleResponses); }) });

      var data = _.flattenDeep(rows);
      var sorted = _.sortBy(data, ['request_someone_criteria_num', 'request_someone_specific_num'])

      $.ajax({
        method: 'POST',
        contentType: 'application/json',
        url: "/app/save",
        data: JSON.stringify(sorted),
      })
      .done(function(res) {
          console.log(res);
          window.location.href = '../thankyou/';
        })
      .fail(function() {
        console.warn('failed to submit');
        submitted = false;
      });
    }

    function nameToValue(cum, curr) {
      cum[curr.name] = curr.value;
      return cum;
    }
  });
});