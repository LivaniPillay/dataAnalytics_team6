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
	  //fs.appendFile('userData.csv',csv, function(err) {
	   // if (err) throw err;
	    //console.log('file saved');
	  //});
	  function doPost(e){
	  	return handleResponse(e);
	}

	  
	});
}

function handleResponse(e) {
  // shortly after my original solution Google announced the LockService[1]
  // this prevents concurrent access overwritting data
  // [1] http://googleappsdeveloper.blogspot.co.uk/2011/10/concurrency-and-google-apps-script.html
  // we want a public lock, one that locks for all invocations
  var lock = LockService.getPublicLock();
  lock.waitLock(30000);  // wait 30 seconds before conceding defeat.
  
  try {
    // next set where we write the data - you could write to multiple/alternate destinations
    var doc = SpreadsheetApp.openById(SCRIPT_PROP.getProperty("key"));
    var sheet = doc.getSheetByName(SHEET_NAME);
    
    // we'll assume header is in row 1 but you can override with header_row in GET/POST data
    var headRow = e.parameter.header_row || 1;
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow()+1; // get next row
    var row = []; 
    // loop through the header columns
    for (i in headers){
      if (headers[i] == "Timestamp"){ // special case if you include a 'Timestamp' column
        row.push(new Date());
      } else { // else use header name to get data
        row.push(e.parameter[headers[i]]);
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
    // return json success results
    return ContentService
          .createTextOutput(JSON.stringify({"result":"success", "row": nextRow}))
          .setMimeType(ContentService.MimeType.JSON);
  } catch(e){
    // if error return this
    return ContentService
          .createTextOutput(JSON.stringify({"result":"error", "error": e}))
          .setMimeType(ContentService.MimeType.JSON);
  } finally { //release lock
    lock.releaseLock();
  }
}

function setup() {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    SCRIPT_PROP.setProperty("key", doc.getId());
}



	
