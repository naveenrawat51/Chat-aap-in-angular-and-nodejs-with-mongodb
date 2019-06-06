$(function () {
  $('form').on('submit', function (event) {
    event.preventDefault();
    var message = $('.message').first().clone();
    message.find('p').text($('input').val());
    message.prependTo('.chat-container');
    $('input').val('');
  });
});