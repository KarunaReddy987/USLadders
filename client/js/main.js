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

		} else {
			return false;
		}
    }
	$(document).ready(function () {
		$('.btn-apply').on('click', applyForJob);
	});

	function applyForJob(evt) {
		//var confirmation = confirm('Are you Sure?');
		console.log(evt);
		//if (confirmation) {
			$.ajax({
				type: 'GET',
				url: '/jobs/apply/' + evt.currentTarget.id
			}).done(function (response) {

				window.location.replace('/applyJob/' + evt.currentTarget.id);
				response.write("<h2><em>evt.currentTarget.id</em></h2>");
				console.log(url);
			});

			//  window.location.replace('/about');

		//}

		// else {
		// 	return false;
		// }
	}

    $(document).ready(function () {
        $('.btn-application').on('click', applicationForJob);
    });

    function applicationForJob(evt) {
      //  var confirmation = confirm('Are you Sure?');
        //console.log(evt);
        //if (confirmation) {
            $.ajax({
                type: 'GET',
                url: '/applications/add/' + evt.currentTarget.id
            }).done(function (response) {
                console.log("karuna gangidi");
                window.location.replace('/applications/add/' + evt.currentTarget.id);

            });

            //  window.location.replace('/about');

        // }
        //
        // else {
        //     return false;
        // }
    }

	$('.doc').on('click', docupload);
	$('.docCV').on('click', docCVupload);


	function docupload(evt) {
		var confirmation = confirm('Are you Sure?');
		var myForm = document.getElementById('myResume');
		formData = new FormData(myForm);

		console.log(formData);
		//console.log(evt);
		if (confirmation) {
			$.ajax({
				type: 'POST',
				url: '/upload/resume/' + evt.currentTarget.id,
				data: formData,
				contentType: false,
				processData: false
			}).done(function (response) {

				//window.location.replace('/applyJob/' + evt.currentTarget.id);
				//response.write("<h2><em>evt.currentTarget.id</em></h2>");
				if (response.success) {
					//alert("Resume Upload Success :)");
					$("#resumeUpldStatus").html("Resume Uploaded successfully");
				}
				else {
					//alert("Resume Upload Failed :(");
					$("#resumeUpldStatus").html("Resume Uploaded failed");
					console.log(response.err);
				}

			});

			//  window.location.replace('/about');

		}

		else {
			return false;
		}
	}

	function docCVupload(evt) {
		var confirmation = confirm('Are you Sure?');
		var myForm = document.getElementById('myCV');
		formData = new FormData(myForm);

		console.log(formData);
		//console.log(evt);
		if (confirmation) {
			$.ajax({
				type: 'POST',
				url: '/upload/cv/' + evt.currentTarget.id,
				data: formData,
				contentType: false,
				processData: false
			}).done(function (response) {

				//window.location.replace('/applyJob/' + evt.currentTarget.id);
				//response.write("<h2><em>evt.currentTarget.id</em></h2>");
				if (response.success) {
					//alert("Resume Upload Success :)");
					$("#cvUpldStatus").html("Cover Letter Uploaded successfully");
				}
				else {
					//alert("Resume Upload Failed :(");
					$("#cvUpldStatus").html("Cover Letter Uploaded failed");
					console.log(response.err);
				}

			});

			//  window.location.replace('/about');

		}

		else {
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

// see  more
$(document).ready(function () {

		$('.star').on('click', function () {
		  $(this).toggleClass('star-checked');
		});

		$('.ckbox label').on('click', function () {
		  $(this).parents('tr').toggleClass('selected');
		});

		$('.btn-filter').on('click', function () {
		  var $target = $(this).data('target');
		  if ($target != 'all') {
			$('.table tr').css('display', 'none');
			$('.table tr[data-status="' + $target + '"]').fadeIn('slow');
		  } else {
			$('.table tr').css('display', 'none').fadeIn('slow');
		  }
		});

	 });
