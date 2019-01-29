"use strict";

/*
 * Gets a value from the chrome extension storage synchronously.
 *
 * Usage: getValue(key, def)
 * Returns: value at key if extant, def if not.
 */
function getValue(key, def) {
	if (userData[key] === null) {
		return def;
	}
	return userData[key];
}

let userData;
chrome.storage.local.get(null, function(items) {
	userData = items;
});
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (const key in changes) {
		userData[key] = changes[key].newValue;
	}
});

//Every time a page loads that we are allowed to access, check whether it is one we want to put scripts on.
chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
	let tab = details.tabId;
	let href = details.url;
	// console.log(href);
	if ((href.match("http://www.scp-wiki.net*") || href.match("http://scp-wiki.wikidot.com*")) && !href.match("iframe") && !href.match(/:\d/)) {
		chrome.tabs.executeScript(tab, {file: "src/scpwiki-utils.js"});

		if (getValue("jumpbox")) {
			chrome.tabs.executeScript(tab, {file: "src/scpwiki-jumpbox.js"});
		}
		if (getValue("pmShortcut")) {
			chrome.tabs.executeScript(tab, {file: "src/scpwiki-pm-shortcut.js"});
		}
		if (getValue("ratingGone")) {
			chrome.tabs.executeScript(tab, {file: "src/scpwiki-rating-b-gone.js"});
		}
		if (getValue("realVotes") && !href.match("forum")) {
			chrome.tabs.executeScript(tab, {file: "src/scpwiki-real-votes.js"});
		}
		if (href.match("scp-series*") && getValue("deadlinks")) {
			chrome.tabs.executeScript(tab, {file: "src/scpwiki-deadlinks-in-series.js"});
		}
		if (href.match("/scp-*") && getValue("prevNext")) {
			chrome.tabs.executeScript(tab, {file: "src/scpwiki-prev-next.js"});
		}
		if (!href.match("/forum/") && (href.match("/scp-*") || href.match("/*-scps") || href.match("/spc-*"))) {
			if (getValue("pageRead")) {
				chrome.tabs.executeScript(tab, {file: "src/scpwiki-page-read.js"});
			}
		}
		if (href.match("forum*")) {
			if (getValue("staffIDs")) {
				chrome.tabs.executeScript(tab, {file: "src/scpwiki-staff-ids.js"});
			}
			if (getValue("authorKarma")) {
				chrome.tabs.executeScript(tab, {file: "src/scpwiki-author-karma.js"});
			}
		}
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	let req = new XMLHttpRequest();
	req.open("GET", request, false);
	req.onload = function () {
		if (req.readyState === 4 && req.status === 200) {
			sendResponse(req.responseText);
		}
	};
	req.send();

	return true;
});
