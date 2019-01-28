/*
SCP-Wiki PM Shortcut
version 1.1
2015-10-21 by Crayne
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
// @name          SCP-Wiki PM shortcut
// @description   Script that adds a small envelope icon next to usernames for a Wikidot PM shortcut
// @include       http://www.scp-wiki.net/*
// @include       http://scp-wiki.wikidot.com/*
// ==/UserScript==
"use strict";

let loginStatus = document.getElementById('login-status');
let myAccount = document.getElementById('my-account');

function addCheckSpan() {
	let span = document.createElement('span');
	span.id = "checkEnvelope";
	span.style.display = "none";
	document.getElementById('recent-posts-container').appendChild(span);
}

function addEnvelopes() {
	// console.log('Doing addEnvelopes');
	if (!document.getElementById('checkEnvelope')) {
		// console.log('Checkspan not found.');
		let container = document.getElementById('content-wrap');
		let spans = container.getElementsByTagName('span');
		let userNumber;

		for (x in spans) {
			if (spans[x].innerHTML && spans[x].innerHTML.indexOf("user:info") !== -1 && spans[x].innerHTML.indexOf("messages#/new/") === -1) {
				// console.log("Found a user");
				userNumber = spans[x].innerHTML.substring(spans[x].innerHTML.indexOf('userInfo(') + 9, spans[x].innerHTML.indexOf(');'));
				spans[x].innerHTML += "<a href=\"http://www.wikidot.com/account/messages#/new/" + userNumber + "\" target=\"_blank\"><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAICAIAAABChommAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAEVSURBVHjaVJDNSsNAFIVnkslkTH8oUjSk0GQRYuLKQKXPoD6BG0HBJ3PlqroQulLjRrtRuxJ8AqEGIvlrMpMZJyKIl7O697v3HC6c7gfnp0eqhgRlAIK/EkDB2jpfX1zO0dnJwa5vh6FHCBaMgV9QQE3L83K5fD9mh0qv37EdazaL4lWSpmWSpFJZVq4+4uurB9cdGx1VoVVtjYbhnnt7/yyEMAzd2CCMNnfRy3Tib20PaM2QvM6r2hmbvOE380WvS6RZmpeTcGdkDXlFIQRItqAQRVE5tokQ+oy/ZKrAdyxzsyhrHbcAwroO+91BywIvsD1VaXMzziklRI4MTDCKHl+TjDVVJv49APxsAZXgp8XbtwADAHq0bNwCmPgUAAAAAElFTkSuQmCC\" style=\"margin-left: 5px; margin-right: 5px;\"></a>";

				if (!document.getElementById('checkEnvelope')) {
					// console.log('Adding checkspan at ' + x);
					addCheckSpan();
				}
			}
		}
	}
}

if (myAccount) {
	let timer = setInterval(addEnvelopes, 250);
}
