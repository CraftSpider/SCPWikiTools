/*
SCP-Wiki Rating-B-Gone!
version 1.0
2016-09-05 by Crayne
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
// @name          SCP-Wiki Rating-B-Gone!
// @description   Hides the rating module, and modifies the rating link at the bottom to not show the current rating
// @include       http://www.scp-wiki.net/*
// @include       http://scp-wiki.wikidot.com/*
// ==/UserScript==

var ratingModules = document.getElementsByClassName("page-rate-widget-box");
var x;

//console.log("Number of rating modules: " + ratingModules.length);

if (ratingModules.length > 0) {
	for (x = 0; x < ratingModules.length; x++) {
		//console.log("Module #: " + x);	
		ratingModules[x].parentNode.style.display = "none";
	}
}

document.getElementById("pagerate-button").innerHTML = "Rate";