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









    // Instantiate the Bootstrap carousel
    $('.multi-item-carousel').carousel({
        interval: false
    });

    // for every slide in carousel, copy the next slide's item in the slide.
    // Do the same for the next, next item.
    $('.multi-item-carousel .item').each(function () {
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        if (next.next().length > 0) {
            next.next().children(':first-child').clone().appendTo($(this));
        } else {
            $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
        }
    });