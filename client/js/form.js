$(function() {
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

    second.change(function() {
      toggleTooltip.call(this);
    });

    second.keypress(function() {
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