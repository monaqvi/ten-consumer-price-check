$(function() {
  var submitted = false;
  (function contactButtons() {
    $('#add_interest').click(function() {
      var add = $('#templates > #interest > div').clone();
      $('#interests').append(add);
      $('#remove_interest').show()
    });

    $('#remove_interest').click(function() {
      var numFields = $('#interests > .query-group').length;
      if(numFields > 1) $('#interests > .query-group:last-of-type').remove();
      if(numFields === 2) $('#remove_interest').hide();
    });
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
                                              .not('#interests input')
                                              .toArray()
                                              .reduce(nameToValue, {});

      var criterion = $('#criteria input:checked').toArray().map(function(e, i) { 
        return { expert_offering_num: i, expert_offering: e.name }; 
      });

      var interests = $('#interests input')
                      .toArray()
                      .filter(function(e) {
                        return e.value;
                      })
                      .map(function(e, i) {
                        return { expert_expertise_num: i , expert_expertise: e.value };
                      });

      interests = !!interests.length ? interests : [ {} ];

      var rows = criterion
                  .map(function(criteria) { return interests.map(function(interest) { return Object.assign({}, criteria, interest); }); })
                  .map(function(combined) { return combined.map(function(e) { return Object.assign({ source: window.location.pathname }, e, singleResponses); }) });

      var data = _.flattenDeep(rows);
      var sorted = _.sortBy(data, ['expert_offering_num', 'expertise_num']);

      $.ajax({
        method: 'POST',
        contentType: 'application/json',
        url: "/app/expert/new",
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