$(function() {
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

    $('.invalid').removeClass('invalid');
    $('#invalid').removeAttr('id');

    if (invalid.length !== 0) {
      $(invalid).parent().addClass('invalid');
      // Important to add to parent to not overwrite individual field ids
      $(invalid[0]).parent().attr('id', 'invalid');
    } else {
      var save = { source: window.location.pathname, };

      $.ajax({
        method: 'POST',
        url: "/app/save",
        data: save,
        success: function(res) {
          console.log(res);
          window.location.href = '../thankyou/';
        }
      });
    }
  });
});