/*
SCP-Wiki PrevNext
version 1.5
2014-04-24 by Crayne
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
// @name          SCP-Wiki PrevNext
// @description   Provides a 'Previous' and 'Next' button for use with the SCP Wiki
// @include       http://www.scp-wiki.net/scp-*
// @include       http://scp-wiki.wikidot.com/scp-*
// ==/UserScript==
"use strict";

let excludeTags = ['joke','archived','explained','decommissioned','tale', 'hub'];
let hostname = location.hostname;
let lastSeries, seriesHTML;

function getSeriesHTML(seriesNum) {

	let req = new XMLHttpRequest();
	let parser = new DOMParser();
	let seriesHTML = null;
	let suffix = "";

	if (seriesNum > 1) {
		suffix += "-" + seriesNum;
	}
	req.open('GET', 'http://' + hostname + '/scp-series' + suffix, false);
	req.onreadystatechange = function () {
		if (req.readyState === 4 && req.status === 200) {
			console.log(req.responseText);
			seriesHTML = parser.parseFromString(req.responseText, "application/xml");
		}
	};
	req.send();
	return seriesHTML;
}

function checkValidSeries(seriesNum) {
    let req = new XMLHttpRequest();
	let seriesExists = false;
	let suffix = "";

	if (seriesNum > 1) {
		suffix += "-" + seriesNum;
	}
    req.open('HEAD', 'http://' + hostname + '/scp-series' + suffix, false);
    req.onreadystatechange = function() {
		if (req.readyState === 4 && req.status === 200) {
			seriesExists = true;
        }
    };
    req.send();
//	console.log('SeriesExists: ' + seriesExists);
	return seriesExists;
}

function getCurSCP() {
	let URLParts = window.location.toString().split('/');
	let SCP = -1;

	for (let x = URLParts.length - 1; x >= 0; x--) {
		if (URLParts[x].indexOf('scp-') !== -1) {
			SCP = parseInt(URLParts[x].substring(4));
			break;
		}
	}
//	console.log('URL: ' + window.location.toString())
//	console.log('curSCP: ' + SCP)
	return SCP;
}

function getSeriesNumber(scp) {
	let seriesNumber = 1;
	if (scp.toString().length > 3) {
		seriesNumber = parseInt(scp.toString().substring(0,1)) + 1;
	}
//	console.log('Length of number: ' + scp.toString().length + '\nSeries: ' + seriesNumber);
	return seriesNumber;
}

function getSCP(direction) { // direction should be -1 or 1
	let newSCP = null;
	let SCPToCheck = curSCP;
	let currSeries = lastSeries;

	while (newSCP === null) {
		SCPToCheck = SCPToCheck + direction;

    	if (SCPToCheck === 0) {
	       newSCP = -1;
    	} else {
//			console.log('SCPToCheck = ' + SCPToCheck);
			currSeries = getSeriesNumber(SCPToCheck);
//			console.log('lastSeries: ' + lastSeries + ' / currSeries: ' + currSeries);
			if (currSeries !== lastSeries) {
	       		lastSeries = currSeries;
//              console.log('currSeries != lastSeries so getting new XML object')
//              console.log('New lastSeries = ' + lastSeries);
	       		if (checkValidSeries(currSeries)) {
//                   console.log('Series is valid!');
		      	     seriesHTML = getSeriesHTML(currSeries);
    			} else {
	       		     newSCP = -1;
    			}
    		}

        	let listItems = seriesHTML.getElementsByTagName('li');
			let SCPString = "SCP-" + SCPToCheck.toString().lpad('0',3);

//			console.log('SCPString: ' + SCPString);

    		for (let x = 0; x < listItems.length; x++) {
                if (listItems[x].children[0].innerHTML.indexOf(SCPString) !== -1 && listItems[x].innerHTML.indexOf('[ACCESS DENIED]') === -1) {
//                  console.log('Checking for ' + SCPToCheck + '\nInnerHTML = ' + listItems[x].innerHTML);
                    newSCP = listItems[x].children[0].innerHTML;
//                  console.log('Eligible scp found: \'' + newSCP + '\'');
                }
	       	}
    	}
    }
//    console.log('newSCP before returning: ' + newSCP);
	return newSCP;
}

let tagDiv = document.getElementsByClassName('page-tags')[0];
let pageCreated = true;

if (document.getElementById('toc0') && document.getElementById('toc0').innerHTML.indexOf('This page doesn\'t exist yet!') !== -1) {
	pageCreated = false;
}

let runScript = true;
let curSCP = getCurSCP();

if (!isNumber(curSCP) || curSCP < 0) {
    runScript = false;
}

if (tagDiv) {
    for (let x = 0; x < excludeTags.length; x++) {
        if (tagDiv.innerHTML.indexOf(excludeTags[x]) !== -1) {
//          console.log('Found tag \'' + excludeTags[x] + '\', not running.');
            runScript = false;
            break;
        }
    }
} else {
	if (!pageCreated) {
//		console.log('Page not yet created, setting runScript to false');
		runScript = false;
	}
}

if (runScript) {
    lastSeries = getSeriesNumber(curSCP);
    seriesHTML = getSeriesHTML(lastSeries);

//  console.log('Series for current SCP = ' + lastSeries);
	let targetDiv = document.getElementById('action-area-top');
	targetDiv.style.width = "100%";
	targetDiv.style.display = "inline-block";
	targetDiv.style.marginBottom = "20px";

//  console.log('Doing previous link');
	let prevSCP = getSCP(-1);
	if (prevSCP !== -1) {
		let prevLink = document.createElement('a');
		prevLink.setAttribute('id', 'prevLink');
		prevLink.setAttribute('href', 'http://www.scp-wiki.net/' + prevSCP);
		prevLink.setAttribute('title', prevSCP);
		prevLink.style.cssFloat = "left";
		prevLink.style.fontWeight = "bold";
		prevLink.innerHTML = "<< Previous";

		targetDiv.appendChild(prevLink);
	}

//  console.log('Doing next link');
	let nextSCP = getSCP(1);
	if (nextSCP !== -1) {
		let nextLink = document.createElement('a');
		nextLink.setAttribute('id', 'nextLink');
		nextLink.setAttribute('href', 'http://www.scp-wiki.net/' + nextSCP);
		nextLink.setAttribute('title', nextSCP);
		nextLink.style.cssFloat = "right";
		nextLink.style.fontWeight = "bold";
		nextLink.innerHTML = "Next >>";

		targetDiv.appendChild(nextLink);
	}
}
