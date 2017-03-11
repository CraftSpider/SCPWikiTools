/*
SCP-Wiki Staff Identification
version 1.2
2016-01-11 by Crayne
2017-03-08 by CraftSpider

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
// @name          SCP-Wiki Staff Identification
// @description   Shows who's staff and what position they hold 
// @include       http://www.scp-wiki.net/forum*
// @include       http://scp-wiki.wikidot.com/forum*
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

/*
 * Gets the staff list page from 05Command.
 * 
 * Usage: GetStaffList()
 * Returns: The staff list, in HTML form.
 */
function GetStaffList() {
	request = new XMLHttpRequest();
	request.open("GET", "http://05command.wikidot.com/senior-staff-list-teams", false);
	request.onload = function(response) {
			return response.responseText;
		};
	request.send();
	return request;
}

var staffText = GetStaffList();
var parser = new DOMParser();
var staff = [];
staffHTML = parser.parseFromString(staffText.responseText, "application/xml");
var staffList = staffHTML.getElementById('page-content');
var currNode;
var position = "";
var stop = false;

for (var x = 0; x < staffList.childNodes.length; x++) {
	currNode = staffList.childNodes[x];
	// console.log("Current nodename = '" + currNode.nodeName +"'");
	// console.log("Current node innerHTML = '" + currNode.innerHTML + "'");
	
	if (currNode.nodeName.toLowerCase() == "p") {
		if (currNode.getElementsByTagName('strong')[0]) {
			positionText = currNode.getElementsByTagName('strong')[0].innerHTML;
			// console.log('raw position text:  \'' + positionText + '\'');
		
			if (positionText.toLowerCase().indexOf('inactive') == -1 && positionText.toLowerCase().indexOf('chat') == -1 && positionText.toLowerCase().indexOf('owner') == -1) {
				stop = false;
				
				position = positionText.replace('Current ','');
				position = position.replace('Active','');
				position = position.replace('s:', '');
				position = position.replace(':', '');
				position = position.trim();
				// console.log('Found position: ' + position);
			} else {
				stop = true;
			}
		}			
	} else if (currNode.nodeName.toLowerCase() == "ul" && position != "" && !stop) {
		lis = currNode.getElementsByTagName('li');
		
		for (y = 0; y < lis.length; y++) {
			userName = lis[y].getElementsByTagName('a')[1].innerHTML;
			staff.push(userName + "|" + position);
			// console.log('New element added: \'' + staff[staff.length - 1] + '\'');
		}
	}
	
	// console.log('Length of array: ' + staff.length);
}

function SetStaffIds() {
	var container;
	
	if (document.getElementById('thread-container')) {
		container = document.getElementById('thread-container');
	} else {
		container = document.getElementsByClassName('thread-container')[0];
	}
	if (container == undefined) {
		return;
	}
	
	var infoSpans = container.getElementsByClassName('info');
	var userName = "";
	var staffName, staffId;
	
	for (var x = 0; x < infoSpans.length; x++) {
		userName = infoSpans[x].getElementsByTagName('span')[0].getElementsByTagName('a')[1].innerHTML;
		// console.log(userName);
		
		if (infoSpans[x].innerHTML.indexOf("SCP Wiki -") == -1) {
			staffName = "";
			staffId = "";
			
			for (var y = 0; y < staff.length; y++) {
				staffName = staff[y].split("|")[0];
				
				if (userName.indexOf(staffName) != -1) {
					staffId = "SCP Wiki - " + staff[y].split("|")[1];
					// console.log('Found ' + staffName);
				}
			}
			
			if (staffId != "") {
				br = infoSpans[x].getElementsByTagName('br')[0];
				staffSpan = document.createElement('span');
				staffSpan.style.fontSize = "0.8em";
				staffSpan.innerHTML = staffId + "<br>";
				
				if (br) {
					infoSpans[x].insertBefore(staffSpan, br.nextSibling);
				} else {
					br = document.createElement('br');
					infoSpans[x].appendChild(br);
					infoSpans[x].appendChild(staffSpan);
				}
			}
		}
	}
}

SetStaffIds();

var timer = setInterval(SetStaffIds, 500);