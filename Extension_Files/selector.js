
var userData;
chrome.storage.local.get(null, function(items) {
	userData = items;
	elementByID('deadlinks').setAttribute('class', (userData.deadlinks ? "active" : ""));
	elementByID('pageRead').setAttribute('class', (userData.pageRead ? "active" : ""));
	elementByID('staffIDs').setAttribute('class', (userData.staffIDs ? "active" : ""));
	elementByID('prevNext').setAttribute('class', (userData.prevNext ? "active" : ""));
	elementByID('jumpbox').setAttribute('class', (userData.jumpbox ? "active" : ""));
	elementByID('pmShortcut').setAttribute('class', (userData.pmShortcut ? "active" : ""));
	elementByID('ratingGone').setAttribute('class', (userData.ratingGone ? "active" : ""));
	elementByID('authorKarma').setAttribute('class', (userData.authorKarma ? "active" : ""));
	elementByID('realVotes').setAttribute('class', (userData.realVotes ? "active" : ""));
});
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
		userData[key] = changes[key].newValue;
	}
});

function elementByID(id) {
	return document.getElementById(id);
}

/* 
 * Sets a value in the chrome extension storage.
 * 
 * Usage: setValue(key, val)
 * Returns: nothing
 */
function setValue(key, val) {
	var obj = {};
	obj[key] = val;
	console.log("set: {" + key + ": " + val + "}");
	chrome.storage.local.set(obj);
}

/*
 * Gets a value from the chrome extension storage synchronously.
 * 
 * Usage: getValue(key, def)
 * Returns: value at key if extant, def if not.
 */
function getValue(key, def) {
	if (userData[key] === null) {
		//console.log("get: {" + key + ": " + def + "}");
		return def;
	}
	//console.log("get: {" + key + ": " + userData[key] + "}");
	return userData[key];
}

function toggleValue(key) {
	setValue(key, (getValue(key) ? false : true ));
	elementByID(key).setAttribute('class', (!userData[key] ? "active" : ""))
}

function addListen() {
	elementByID('deadlinks').addEventListener("click", function(){toggleValue('deadlinks');});
	elementByID('pageRead').addEventListener("click", function(){toggleValue('pageRead');});
	elementByID('staffIDs').addEventListener("click", function(){toggleValue('staffIDs');});
	elementByID('prevNext').addEventListener("click", function(){toggleValue('prevNext');});
	elementByID('jumpbox').addEventListener("click", function(){toggleValue('jumpbox');});
	elementByID('pmShortcut').addEventListener("click", function(){toggleValue('pmShortcut');});
	elementByID('ratingGone').addEventListener("click", function(){toggleValue('ratingGone');});
	elementByID('authorKarma').addEventListener("click", function(){toggleValue('authorKarma');});
	elementByID('realVotes').addEventListener("click", function(){toggleValue('realVotes');});
}

window.onload = addListen;