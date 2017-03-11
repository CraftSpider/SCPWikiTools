/*
SCP-Wiki JumpBox
version 1.8
2014-05-19 by Crayne
2017-03-09 by CraftSpider

--------------------------------------------------------------------
This is a Chrome Extension script.

To install, either in chrome on the top right select the More Tools/Extensions
drop down, or navigate to chrome://Extensions, and drop the folder this
file is contained within onto that page.

To uninstall, go to More Tools/Extensions,
select "SCP Wiki Tools", and click Uninstall.
--------------------------------------------------------------------
*/
// ==UserScript==
// @name          SCP-Wiki JumpBox
// @description   Adds a small textbox and a button to the login-status div to allow you to jump directly to any scp article you want
// @include       http://www.scp-wiki.net/*
// @include       http://scp-wiki.wikidot.com/*
// ==/UserScript==

/*
 * Removes all whitespace from the beginning and the end of a string
 *
 * Usage: myString.trim()
 * Returns: string, the string the function is applied to, stripped of all whitespace at the beginning and end.
 */
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, "");
}

String.prototype.lpad = function(padding, length) {
	str = this;
	while (str.length < length) {
		str = padding + str;
	}
	return str;
}

/*
 * Merges multiple items into one item in an array. If values are numeric, adds them. If values are  strings, concatenates them. If values are mixed, will add concurrent numeric values and concatenate when encountering a string.
 *
 * Usage: Array.mergeItems(start, stop)
 * Returns: array, the array the function has been applied to, with all items between and including start 
 *          and stop merged into one new item
 */
Array.prototype.mergeItems = function (start, stop)
{
	var newItem;
	if (!isNaN(parseFloat(this[start])) && isFinite(this[start])) {
		newItem = 0;
	} else {
		newItem = "";
	}	
	for (x = start; x <= stop; x++) {
		//console.log('Item #' + x + ' = ' + this[x]);
		newItem = newItem + this[x];
		//console.log('newItem = ' + newItem);
	}
	
	this.splice(start, ((stop - start) + 1));
	//console.log('[' + this.join(', ') + ']');
	this.splice(start, 0, newItem);
	return this;
}

/*
 * Checks to see if a value is numeric without the pitfalls of isNumeric
 *
 * Usage: isNumber(value)
 * Returns: boolean true if numeric, boolean false if not numeric
 */
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

/*
 * Changes the current location to the desired article
 *
 * Usage: jump()
 * Returns: -
 */
function jump() {
	var input = document.getElementById('jumpBox').value.trim();
	var reqPageArr = input.split("|");
//	console.log('Array: ' + reqPageArr);
	if (reqPageArr.length > 2) {
//		console.log('ReqPageArr > 2');
		reqPageArr.mergeItems(1, reqPageArr.length - 1);
	}
	if (reqPageArr.length == 1) {
//		console.log('ReqPageArr.length = 1 and we\'re looking for a scip');	
		page = reqPageArr[0].toLowerCase();
		if (isNumber(page)) {
			page = "scp-" + page.toString().lpad('0',3);
		}
	} else {
		var scip = false;
		switch (reqPageArr[0].toLowerCase()) {
			case "j":
//				console.log('ReqPageArr.length > 1 and -J specifically requested');
				page = reqPageArr[1] + "-j";
				scip = true;
			break;
			case "x":
//				console.log('ReqPageArr.length > 1 and -EX specifically requested');
				page = reqPageArr[1] + "-ex";
				scip = true;
			break;
			case "a":
//				console.log('ReqPageArr.length > 1 and -ARC specifically requested');
				page = reqPageArr[1] + "-arc";
				scip = true;
			break;
			case "d":
//				console.log('ReqPageArr.length > 1 and -D specifically requested');
				page = reqPageArr[1] + "-d";
				scip = true;
			break;
			case "h":
//				console.log('ReqPageArr.length > 1 and -hub specifically requested');
				page = reqPageArr[1] + "-hub";
				scip = false;
			break;
			case "t":
//				console.log('ReqPageArr.length > 1 and tale specifically requested');
				page = reqPageArr[1];
				scip = false;
			break;
			default:
//				console.log('ReqPageArr.length > 1 and no specific page type requested');
				page = reqPageArr[1];
				scip = false;
		}
		if (scip && reqPageArr[1].toLowerCase().indexOf('scp-') == -1) {
			page = "scp-" + page;
			if (page.indexOf('--') != -1) {
				page = page.replace('--', '-');
			}
		}
	}
//	console.log('Page = ' + page);
	window.location = "http://www.scp-wiki.net/" + page;
}

/*
 * Checks to see if a value is numeric without the pitfalls of isNumeric
 *
 * Usage: isNumber(value)
 * Returns: boolean true if numeric, boolean false if not numeric
 */
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function checkEnterPress(e) {
	// look for window.event in case event isn't passed in
	if (typeof e == 'undefined' && window.event) { e = window.event; }
	if (e.keyCode == 13) { document.getElementById('jumpButton').click(); }
}

var jumpBox = document.createElement('input');
jumpBox.setAttribute('type', 'text');
jumpBox.setAttribute('size', '10');
jumpBox.setAttribute('id', 'jumpBox');
jumpBox.addEventListener('keydown', checkEnterPress, false);
jumpBox.style.marginLeft = "3px";
jumpBox.style.marginRight = "3px";
jumpBox.style.backgroundColor = "#330000";
jumpBox.style.border = "1px solid #999999";
jumpBox.style.borderRadius = "5px";
jumpBox.style.boxShadow = "1px 1px 3px rgba(0, 0, 0, 0.5) inset";
jumpBox.style.color = "#CCCCCC";

var jumpButton = document.createElement('input');
jumpButton.setAttribute('id', 'jumpButton');
jumpButton.setAttribute('type', 'button');
jumpButton.setAttribute('value', 'Jump!');
jumpButton.addEventListener('click', jump, false);
jumpButton.style.padding = "2px 5px";
jumpButton.style.background = "linear-gradient(to bottom, #996666, #663333, #330000) repeat scroll 0 0 rgba(0, 0, 0, 0)";
jumpButton.style.border = "1px solid #999999";
jumpButton.style.borderRadius = "5px";
jumpButton.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.5)";
jumpButton.style.color = "#CCCCCC";
jumpButton.style.cursor = "pointer";
jumpButton.style.fontSize = "90%";
jumpButton.style.fontWeight = "bold";

var loginStatus = document.getElementById('login-status');

loginStatus.appendChild(jumpBox);
loginStatus.appendChild(jumpButton);