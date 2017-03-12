/*
SCP-Wiki SCP Series dead links checker
version 1.1
2015-07-27 by Crayne
2017-03-08 by CraftSpider
Copyright (c) 2013-2015 Crayne

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
// @name          SCP-Wiki SCP Series dead links checker
// @description   Script that adds small embellishments to the experience
// @include       http://www.scp-wiki.net/scp-series*
// @include       http://scp-wiki.wikidot.com/scp-series*
// ==/UserScript==

/*
 * Removes all whitespace from the beginning and the end of a string
 *
 * Usage: myString.trim()
 * Returns: string, the string the function is applied to, stripped of all whitespace at the beginning and end.
 */
String.prototype.trim = function ()
{
	
	return this.replace(/^\s+|\s+$/g, "");
	
}

var myAccount = document.getElementById('my-account');

if (myAccount)
{
	var links = document.getElementsByTagName('a');
	var wrongTitles = new Array();
	var noTitles = new Array();
	var output;
	
	for (var x = 0; x < links.length; x++)
	{
		if (links[x].className == "newpage")
		{
			if (links[x].parentNode.innerHTML.indexOf('[ACCESS DENIED]') == -1)
			{
				wrongTitles.push(links[x].innerHTML);
			}
		}
	} 
	
	if (wrongTitles.length > 0)
	{
		output = "<h3>Titles not removed after deletion:</h3>";
		output += "<p>" + wrongTitles.join('<br>');
		output += "</p>"
	}
	else
	{
		output = "<h3>No dead links detected.</h3>";
	}

	var container = document.getElementById('main-content');
	var checkDiv = document.createElement('div');
	checkDiv.setAttribute('class', 'content-panel standalone series');
	checkDiv.innerHTML = output;
	container.insertBefore(checkDiv, container.childNodes[0]);
}