/*
SCP-Wiki Real Votes
version 1.8
2016-11-24

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
// @name          SCP-Wiki Real Votes
// @description   Counts the real amount of votes for an article 
// @include       http://www.scp-wiki.net/*
// @include       http://scp-wiki.wikidot.com/*
// @exclude       http://www.scp-wiki.net/forum*
// @exclude       http://scp-wiki.wikidot.com/forum*
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

var scripts = document.getElementsByTagName('script');
var pageID, pageName, pair, part, scriptContent, els, el, div, content, voteData, popUpWidth;
var res = "";

function popUp(message, width, height, reload) {
	reload = reload || false;
	width = width || 200;
	height = height || 200;
	var body = document.getElementById("realVotes").parentNode;
	var masterDiv = document.getElementById('messagePopup');
	
	if (masterDiv) {
		body.removeChild(masterDiv);
	}
	
	marginH = Math.ceil(parseFloat(width) / 2.00);
	marginV = Math.ceil(parseFloat(height) / 2.00);
	masterDiv = document.createElement('div');
	masterDiv.id = "messagePopup";
	masterDiv.style.position = "absolute";
	masterDiv.style.left = "85%";
	masterDiv.style.top = (height+25) + "px";
	masterDiv.style.width = width + "px";
	masterDiv.style.height = height + "px";	
	masterDiv.style.backgroundColor = "#fff";
	masterDiv.style.padding = "0px";
	masterDiv.style.marginLeft = "-" + marginH + "px";
	masterDiv.style.marginTop = "-" + marginV + "px";
	masterDiv.style.border = "2px solid #333";
	masterDiv.style.borderRadius = "10px";
	masterDiv.style.boxShadow = "0 2px 6px rgba(102, 0, 0, 0.5)";
	masterDiv.style.zIndex = "99";
	masterDiv.style.padding = "5px";
	var closeDiv = document.createElement('div');
	closeDiv.style.backgroundColor = "#333";
	closeDiv.style.height = "15px";
	closeDiv.style.color = "#fff";
	closeDiv.style.fontWeight = "bold";
	closeDiv.style.padding = "2px";
	closeDiv.style.paddingBottom = "4px";
	closeDiv.style.textAlign = "right";
	closeDiv.innerHTML = "[X]";
	closeDiv.onmouseover = function () { this.style.cursor = 'pointer' };
	closeDiv.onclick = function () { this.parentNode.style.display = 'none'; if (reload) { window.location.href = window.location.href; } };
	var contentDiv = document.createElement('div');
	contentDivHeight = height - 30; //10px for the closeDiv and 10px for the padding
	contentDiv.style.padding = "5px";
	contentDiv.style.height = contentDivHeight + "px";
	contentDiv.innerHTML = message;
	masterDiv.appendChild(closeDiv);
	masterDiv.appendChild(contentDiv);
	body.appendChild(masterDiv);
}

function getVotes(pageID, pageName) {
	request = new XMLHttpRequest();
	request.open("POST", "http://ferryfm13.thirteen.axc.nl/scp/misc/callWikidot.php?c=rating&p=" + pageID + "&n=" + pageName, false);
	request.onload = function(response) {
		};
	request.send();
	return request;
}

function getVoteData(pageID) {
	var voteData = JSON.parse(getVotes(pageID, pageName).responseText);
	var res = "";
	res += "<table cellpadding=\"1\" cellspacing=\"1\" style=\"border: 0;\" border=\"0\">";
	res += "<tr><td>Real rating:</td><td>" + voteData.realRating + "</td></tr>";
	res += "<tr><td>Upvotes:</td><td>" + voteData.upvotes + "</td></tr>";
	res += "<tr><td>Downvotes:</td><td>" + voteData.downvotes + "</td></tr>";
	res += "<tr><td>Votes from deleted accounts:</td><td>" + voteData.deletedAccounts + "</td></tr>";
	res += "<tr><td>Total number of votes:</td><td>" + voteData.totalVotes + "</td></tr>";
	res += "<tr><td>Double votes:</td><td>" + voteData.doubleVotes + "</td></tr>";
	res += "</table>";
	popUp(res, 250, 150);
}

for (x = 0; x < scripts.length; x++) {
	if (scripts[x].innerHTML.indexOf('WIKIREQUEST.info.pageId') != -1) {
		scriptContent = scripts[x].innerHTML.split(";");

		for (part in scriptContent) {
			pair = scriptContent[part].split('=');
		
			if (pair[0].trim() == "WIKIREQUEST.info.pageId") {
				pageID = pair[1].trim();
				// console.log("Found pageID! Is: " + pageID);
			}
			
			if (pair[0].trim() == "WIKIREQUEST.info.requestPageName") {
				pageName = pair[1].trim();
				// console.log("Found pageName! Is: " + pageName);
			}
 		}
	}
}

content = document.getElementById('page-content');
els = content.getElementsByTagName('div');
// console.log('Num of divs: ' + els.length);

for (el in els) {
	if (els[el].className == "page-rate-widget-box") {
		div = document.createElement('div');
		div.id = "realVotes"
		div.style.fontSize = "8pt";
		div.style.marginTop = "-7px";
		div.style.marginBottom = "5px";
		div.innerHTML = "+ <u>Show extended rating information</u>";
		div.addEventListener("click", function () { getVoteData(pageID, pageName); }, true);
		els[el].parentNode.appendChild(div);
		break;
	}
}