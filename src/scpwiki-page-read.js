/*
SCP-Wiki HIRTOY? (Have I Read This One Yet?)
version 1.0
2015-11-13 by Crayne
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
// @name          SCP-Wiki HIRTOY?
// @description   Determines whether you've read this SCP article yet.
// @include       http://www.scp-wiki.net/scp-*
// @include       http://scp-wiki.wikidot.com/scp-*
// ==/UserScript==
"use strict";

let page, img, imgAlt, imgContent, btn, btnActionText;
let onSCP = location.href.indexOf("scp-series") === -1;
const imgRead = "data:image/png;base64,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";
const imgUnread = "data:image/png;base64,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";
const imgUnknown = "data:image/png;base64,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";

function getPageInfo() {
	let pageInfo = document.getElementById("page-info");
	let revision = "";
	for (const char of pageInfo.innerText) {
		if (isNumber(char)) {
			revision += char;
		} else if (char === ',') {
			break;
		}
	}
	revision = +revision;
	let date = pageInfo.firstElementChild.innerHTML;
	date = date.substring(0, date.indexOf("(") - 1);

	return [revision, date];
}

/*
 * Checks whether a user has already read a page (i.e. checks if there's a database record for the combination of username and page title.)
 *
 * Usage: getPageRead()
 * Returns: 1 or 0, depending on whether the member's read the page according to the database
 */
function getPageRead(page) {
	// console.log('member = ' + member + ', page = ' + page);
	let pages = getValue("pagesRead", {});

	if (pages[page] === undefined) {
		return false;
	}

	if (onSCP) {
		let pageInfo = getPageInfo();
		let checkInfo = pages[page];

		return pageInfo[0] === checkInfo[0] && pageInfo[1] === checkInfo[1];
	} else {
		return true;
	}
}

/*
 * Marks a page as read for the current member (i.e. first checks if it's already read and if not, inserts a record.)
 *
 * Usage: markPageRead()
 * Returns: 1 or 2: 1 = marked page as read, 2 = page already marked as read, did fuck all.
 */
function markPageRead() {
	if (document.getElementById('HIRTOYImage')) {
		document.getElementById('HIRTOYImage').src = imgRead;
	}
	let pagesRead = getValue("pagesRead", {});
	pagesRead[page] = getPageInfo();
	setValue("pagesRead", pagesRead);
}

function unmarkPageRead() {
	if (document.getElementById('HIRTOYImage')) {
		document.getElementById('HIRTOYImage').src = imgUnread;
	}
	let pagesRead = getValue("pagesRead", {});
	delete pagesRead[page];
	setValue("pagesRead", pagesRead);
}

function togglePageMark() {
	if (getPageRead(page)) {
		unmarkPageRead();
	} else {
		markPageRead();
	}
}

/*
 * Toggles the automarkasread setting for Extension
 *
 * Usage: toggleMarkAsRead()
 * Returns: nothing
 */
function toggleAutoMarkAsRead() {
	if (getValue("autoMark", 0) === 0) {
		setValue("autoMark", 1);
		document.getElementById('btnAutoMarkToggle').value = "Toggle Auto Mark As Read: ON";
	} else {
		setValue("autoMark", 0);
		document.getElementById('btnAutoMarkToggle').value = "Toggle Auto Mark As Read: OFF";
	}
}

/*
 * Checks whether a given SCP page was read, and if it was, adds a checkmark after its link.
 *
 * Usage: checkReadSCP(page, link)
 * Returns: nothing
 */
function checkReadSCP(page, link) {
	let pageRead = getPageRead(page);
	console.log(pageRead);
	console.log(page);
	if (pageRead === true) {
		link.innerHTML = link.innerHTML + " <span style=\"color: #2adb20; font-weight: bold;\">&checkmark;</span>";
	}
}

/*
 * Main running loop, called after extension preload.
 *
 * Usage: main()
 * Returns: nothing
 */
function main() {
	//We check for what page we are on, of the pages we want to activate on.
	let scpLinks = document.getElementsByTagName("li");

	if (window.location.href.indexOf("scp-series") !== -1) { //Main series
		for (let x = 0; x < scpLinks.length; x++) {
			page = scpLinks[x].innerHTML.match(/(SCP-\d{3,4})/);

			if (page != null) {
				page = page[0];
				checkReadSCP(page, scpLinks[x]);
			}
		}
	} else if (window.location.href.indexOf("joke-scps") !== -1) { //Joke Series, weirder RegExp
		for (let x = 0; x < scpLinks.length; x++) {
			page = scpLinks[x].innerHTML.match(/((?:SCP|SPC)-.*-(?:J|CU)(?:-EX)?)/);

			if (page != null) {
				page = page[0];
				checkReadSCP(page, scpLinks[x]);
			}
		}
	} else if (window.location.href.indexOf("archived-scps") !== -1) { //Archived series
		for (let x = 0; x < scpLinks.length; x++) {
			page = scpLinks[x].innerHTML.match(/(SCP-\d{3,4}-ARC)/);

			if (page != null) {
				page = page[0];
				checkReadSCP(page, scpLinks[x]);
			}
		}
	} else if (window.location.href.indexOf("scp-ex") !== -1) { //Explained Series
		for (let x = 0; x < scpLinks.length; x++) {
			page = scpLinks[x].innerHTML.match(/(SCP-\d{3,4}-EX)/);

			if (page != null) {
				page = page[0];
				checkReadSCP(page, scpLinks[x]);
			}
		}
	} else {
		page = document.getElementById('page-title').innerHTML.trim();
		let pageRead = getPageRead(page);
		if (getValue("autoMark", 0) === 0) {
			btnActionText = "OFF";
		} else {
			btnActionText = "ON";
		}

		if (pageRead === false && getValue("autoMark", 0) === 1) {
			markPageRead();
			pageRead = 1;
		}

		switch (pageRead) {
			case false:
				imgContent = imgUnread;
				imgAlt = "Click here to mark this article as read";
			break;

			case true:
				imgContent = imgRead;
				imgAlt = "You've read this page";
			break;

			default:
				imgContent = imgUnknown;
				imgAlt = "What the hell happened there, John?";
		}

		let pageTitleDiv = document.getElementById('page-title');
		img = document.createElement('img');
		img.id = "HIRTOYImage";
		img.src = imgContent;
		img.border = 0;
		img.alt = imgAlt;
		img.title = imgAlt;
		img.style.position = "relative";
		img.style.bottom = "0";
		img.style.verticalAlign = "bottom";
		img.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.5)";

		if (pageRead === false && getValue("autoMark", 0) === 0) {
			img.addEventListener("click", togglePageMark, true);
			//console.log("Added image listener");
		}

		pageTitleDiv.insertBefore(img, pageTitleDiv.childNodes[0]);
		btn = document.createElement('input');
		btn.type = "button";
		btn.addEventListener("click",  toggleAutoMarkAsRead, true);
		btn.value = "Toggle Auto Mark As Read: " + btnActionText;
		btn.style.fontSize = "8pt";
		btn.style.float = "right";
		btn.style.position = "relative";
		btn.style.bottom = "0";
		btn.id = "btnAutoMarkToggle";
		btn.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.5)";
		pageTitleDiv.appendChild(btn);
	}
}

let interval = setInterval(function() {
	if (userData) {
		//console.log("Started " + interval);
		main();
		clearInterval(interval);
	}
}, 500);
