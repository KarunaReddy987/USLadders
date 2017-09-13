$(function () {
	$('#nav li a').click(function () {
		$('#nav li').removeClass();
		$($(this).attr('href')).addClass('active');
	});
})




	$(document).ready(function () {
		$('.deleteUser').on('click', deleteUser);
	});

	function deleteUser() {
		var confirmation = confirm('Are you Sure?');

		if (confirmation) {
			$.ajax({
				type: 'DELETE',
				url: '/jobs/delete/' + $(this).data('id')
			}).done(function (response) {
				window.location.replace('/');
			});
			window.location.replace('/');

		} else {
			return false;
		}
}