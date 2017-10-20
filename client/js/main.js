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

	$(function () {

		$('#login-form-link').click(function (e) {
			$("#login-form").delay(100).fadeIn(100);
			$("#register-form").fadeOut(100);
			$('#register-form-link').removeClass('active');
			$(this).addClass('active');
			e.preventDefault();
		});
		$('#register-form-link').click(function (e) {
			$("#register-form").delay(100).fadeIn(100);
			$("#login-form").fadeOut(100);
			$('#login-form-link').removeClass('active');
			$(this).addClass('active');
			e.preventDefault();
		});

	});


    // Instantiate the Bootstrap carousel

 


    // for every slide in carousel, copy the next slide's item in the slide.
    // Do the same for the next, next item.
/*

   $('.multi-item-carousel').carousel({
		interval: true
    });
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

*/
	$('#register-submit').click(function (evt) {
		evt.preventDefault()
		var password = $("#password").val();
		var confirmPassword = $("#confirmpassword").val();

		if (password != confirmPassword) {
			alert("both the password should match");
			console.log("Not equal");
		} else {
			
		}

});
