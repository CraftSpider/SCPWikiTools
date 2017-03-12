
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

var userData;
chrome.storage.local.get(null, function(items) {
	userData = items;
});
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		userData[key] = changes[key].newValue;
	}
});

//Every time a page loads that we are allowed to access, check whether it is one we want to put scripts on.
chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
	for (key in details) {
		//console.log(key + ": " + details[key]);
	}
	var tab = details.tabId;
	var href = details.url;
	// console.log(href);
	if ((href.match("http://www.scp-wiki.net*") || href.match("http://scp-wiki.wikidot.com*")) && !href.match("iframe")) {
		if (getValue("jumpbox")) {
			chrome.tabs.executeScript(tab, {file: "scpwiki-jumpbox.js"});
		}
		if (getValue("pmShortcut")) {
			chrome.tabs.executeScript(tab, {file: "scpwiki-pm-shortcut.js"});
		}
		if (getValue("ratingGone")) {
			chrome.tabs.executeScript(tab, {file: "scpwiki-rating-b-gone.js"});
		}
		if (getValue("realVotes") && !href.match("forum")) {
			chrome.tabs.executeScript(tab, {file: "scpwiki-real-votes.js"});
		}
		if (href.match("scp-series*") && getValue("deadlinks")) {
			chrome.tabs.executeScript(tab, {file: "scpwiki-deadlinks-in-series.js"});
		}
		if (href.match("/scp-*")) {
			if (getValue("pageRead")) {
				chrome.tabs.executeScript(tab, {file: "scpwiki-page-read.js"});
			}
			if (getValue("prevNext")) {
				chrome.tabs.executeScript(tab, {file: "scpwiki-prev-next.js"});
			}
		}
		if (href.match("forum*")) {
			if (getValue("staffIDs")) {
				chrome.tabs.executeScript(tab, {file: "scpwiki-staff-ids.js"});
			}
			if (getValue("authorKarma")) {
				chrome.tabs.executeScript(tab, {file: "scpwiki-author-karma.js"});
			}
		}
	}
});