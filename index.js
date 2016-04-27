var express = require('express');
var path = require('path');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var json2csv = require('json2csv');
var fields = ['firstname', 'lastname', 'age', 'travellerType', 'numberOfGuests', 'privateRoom', 'cleanliness', 'locationPreference', 'price'];

app.set('port', (process.env.PORT || 5000));

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views/pages/');
app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.render("listingSelection")
});

app.post('/listing', function(request, response){
	 var obj = request.body;
	 console.log(obj.listingId);

});

app.post('/confirm', function(request, response) {
	 var obj = JSON.stringify(request.body);
	 console.log('body: ' + obj);

	 appendUserData(obj, function(err, result){
	 	 if(result)
	 	 {
	 	 	console.log(result);
	 	 	response.send(true);
	 	 }
	 	 else{
		 	 console.log("Something went wrong;")	
	 	 }
	 });
});

app.get('/confirm/:listingId', function(request, response) {
	console.log("listingId " + request.params.listingId);
	response.render("personalDetails", {listingId: request.params.listingId});
});

app.get('/completed', function(request, response) {
	response.render("confirmation");
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


fs.writeFile('userData.json', "", function(err) {
	    if (err) throw err;
	    console.log('file saved');
});

function appendUserData(userData, callback){
	fs.appendFile('userData.json',"\r\n" + userData,function(err) {
	  if (err) throw err;
	  callback(err, true);
	});
}

function convertToJson(){
	 var arr =[];
	 arr.push(request.body);

	 console.log("arr " + JSON.stringify(arr));
	 json2csv({ data: arr}, function(err, csv) {
	  if (err) console.log(err);
	  fs.appendFile('userData.csv',csv, function(err) {
	    if (err) throw err;
	    console.log('file saved');
	  });
	});
}



	