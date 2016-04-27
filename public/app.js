console.log("Javascript loaded");
$(function(){

	var info ={};

	$("#personalDetailsSubmit").on('click', function(event){
	
		info.firstname = $("#firstname").val();
		info.lastname = $("#lastname").val();
		info.age = $("#age").val();
		info.travellerType = $("input[name=travellerType]:checked").val();
		info.numberOfGuests = $("#numberOfGuests").val();
		info.privateRoom =$("input[name=privateRoom]:checked").val();
		info.cleanliness = $("input[name=cleanliness]:checked").val();
		info.locationPreference = $("input[name=locationPreference]:checked").val();
		info.price = $("input[name=price]:checked").val();

		var url = window.location.href.split("/");
		info.listingId = url[url.length-1];

		console.log(JSON.stringify(info));

		$.ajax({
			type: 'POST',
			data: JSON.stringify(info),
	        contentType: 'application/json',
            url: '../confirm',						
            success: function(data) {
                console.log(data);
                window.location="../completed";
            }});

	});

	$("#listingSubmit").on('click', function(event){

		 info.listingId = $("#listingId").val();

		 window.location="../confirm/"+info.listingId;
	});


	$("#backButton").on('click', function(event){

		window.location="/";
	});

	$("#airBnbView").on('click', function(event){

		var listingId =	$("#listingId").val();

		window.open(
		  'https://www.airbnb.com/rooms/'+listingId,
		  '_blank' // <- This is what makes it open in a new window.
		);
	});

});