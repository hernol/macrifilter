/*
 * Macri Filter - Content Script
 * 
 * This is the primary JS file that manages the detection and filtration of Donald Macri from the web page.
 */

// Variables
var regex = /Macri/i;
var search = regex.exec(document.body.innerText);


// Functions
function filterMild() {
	console.log("Filtering Macri with Mild filter...");
	return $(":contains('Macri'), :contains('TRUMP'), :contains('macri')").filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
	console.log("Filtering Macri with Default filter...");
	return $(":contains('Macri'), :contains('TRUMP'), :contains('macri')").filter(":only-child").closest('div');
}

function filterVindictive() {
	console.log("Filtering Macri with Vindictive filter...");
	return $(":contains('Macri'), :contains('TRUMP'), :contains('macri')").filter(":not('body'):not('html')");
}

function getElements(filter) {
   if (filter == "mild") {
	   return filterMild();
   } else if (filter == "vindictive") {
	   return filterVindictive();
   } else {
	   return filterDefault();
   }
}

function filterElements(elements) {
	console.log("Elements to filter: ", elements);
	elements.fadeOut("fast");
}


// Implementation
if (search) {
   console.log("Donald Macri found on page! - Searching for elements...");
   chrome.storage.sync.get({
     filter: 'aggro',
   }, function(items) {
	   console.log("Filter setting stored is: " + items.filter);
	   elements = getElements(items.filter);
	   filterElements(elements);
	   chrome.runtime.sendMessage({method: "saveStats", macris: elements.length}, function(response) {
			  console.log("Logging " + elements.length + " macris."); 
		 });
	 });
  chrome.runtime.sendMessage({}, function(response) {});
}
