/**
 * Created by blaz on 29. 04. 16.
 */

$(function() {
    $('#input-search').on('keyup', function() {
      var rex = new RegExp($(this).val(), 'i');
        $('.searchable-container .items').hide();
        $('.searchable-container .items').filter(function() {
            return rex.test($(this).text());
        }).show();
    });
});
