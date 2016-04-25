console.log("Javascript loaded");
$(function(){


	$("#personalDetailsSubmit").on('click', function(event){

		window.location = '../listings';
	});

	$("#listingSelectionSubmit").on('click', function(event){

		window.location = '../confirm';
	});

	$("#confirmation").on('click', function(event){

		window.location="../";
		
	});


});