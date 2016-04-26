console.log("Javascript loaded");
$(function(){


	$("#personalDetailsSubmit").on('click', function(event){

		var info ={};
		info.firstname = $("#firstname").val();
		info.lastname = $("#lastname").val();
		info.age = $("#age").val();
		info.travellerType = $("input[name=travellerType]:checked").val();
		info.numberOfGuests = $("#numberOfGuests").val();
		info.isPrivateRoom = $('#isPrivateRoom').is(':checked');
		info.cleanliness = $("input[name=cleanliness]:checked").val();
		info.locationPreference = $("input[name=locationPreference]:checked").val();
		info.price = $("input[name=price]:checked").val();

		$.ajax({
			type: 'POST',
			data: JSON.stringify(info),
	        contentType: 'application/json',
            url: 'http://localhost:5000/listings',						
            success: function(data) {
                console.log(data);
              	console.log(JSON.stringify(info));
              	window.location = '../listings';
            }});
		

	});

	$("#listingSelectionSubmit").on('click', function(event){

		window.location = '../confirm';
	});

	$("#confirmation").on('click', function(event){

		window.location="../";
		
	});


});