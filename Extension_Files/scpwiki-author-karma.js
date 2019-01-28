/*
SCP-Wiki AuthorKarma
version 1.2
2016-05-03 by Crayne
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
// @name          SCP-Wiki AuthorKarma
// @description   Replaces Wikidot karma to show the number of articles/tales written by a user
// @include       http://www.scp-wiki.net/forum*
// @include       http://scp-wiki.wikidot.com/forum*
// ==/UserScript==
"use strict";

function getAuthorStats() {
	let request = new XMLHttpRequest();
	request.open("GET", "http://sandboxcrayne.wikidot.com/author-stats", false);
	request.onload = function(response) {
			return response;
		};
	request.send();
	return request;
}

let rankingText = getAuthorStats();
let parser = new DOMParser();
let rankingHTML = parser.parseFromString(rankingText.responseText, "text/html");

function setAuthorKarma() {
	let infoSpans = document.getElementsByClassName('info');
	// console.log('Number of infoSpans: ' + infoSpans.length);
	let lastRun = rankingHTML.getElementById("u-lastRun").innerHTML;

	for (let x = 0; x < infoSpans.length; x++) 	{
		let infoSpan = infoSpans[x];
		let userName = infoSpan.getElementsByTagName('a')[1].innerHTML;
		// console.log("Username: " + userName);

		if (userName.indexOf(lastRun) === -1) {
			let numPages = 0;
			let karmaImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAASEAYAAACFmmsvAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAhAAAAEgCh1htJAAAAsklEQVRYw+2TMQpEIQxE47JXCESwSe/9T2JvI0TwEP83rq0IgSySV9kMjJkZAAcAAELOOef8PKfCUkopJQTrD2jx/T1SSimlvaC11lqztq3Px9rAv7AacWvSx4dARETcC8YYYwxr2/r4NCarEbcmfXwIIiKivaD33nu3tq2PT2OyGnFr0seHiDHGGPcCERERa9v6+DQmqxG3Jn18CGZm5r2g1lprtbatj09jshpxa9LOIS96e0EiK4VnoAAAAABJRU5ErkJggg==)";
			let trs = rankingHTML.getElementsByTagName('tr');
			// console.log('Number of trs found: ' + trs.length);

			for (let y = 0; y < trs.length; y++) {
				if (trs[y].innerHTML.indexOf(userName) !== -1) {
					// console.log(userName + " found!");
					let tds = trs[y].getElementsByTagName('td');
					numPages = +tds[tds.length - 1].innerHTML;
					break;
				}
			}

			// console.log("Articles written: " + numPages);

			if (numPages > 50) {
				karmaImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAASEAYAAACFmmsvAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAhAAAAEgCh1htJAAAAwElEQVRYw+2VsQ3EIAxFzYk5MoEpKUiVJTJN6kyTJVKFghImyByRuIZDdxWxhETO4lUUfMn87y8AOgAAIBAREWOkCkMIIQQhWj+gFvJz8F6IO89SKka6bc/n1XqAp5A3gmvSZCP2fZ7PsyyYpm0bhtZj16dXI5E3gmvSZCO8P4471VBqHDka1quR+Po1eCZNNkJra6+rLHDOGCnL9/6NXo1EzpZr0mQjtLZ2WcoC54xZ19Zj16dXI/FTDY5Jd4i8AV1FMsiX42vjAAAAAElFTkSuQmCC)";
				// console.log("Karma level 5");
			} else if (numPages > 15) {
				karmaImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAASEAYAAACFmmsvAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAhAAAAEgCh1htJAAAAwklEQVRYw+2TMQ6EIBBFhw3HIJ5gLCmw8hKextrTeAkrKSjlBGaOYeI2LMlWSELC7oRXUfiT7//zARoAACAQERHvO1fovffeC1H7B0ohPw+llFIqLSAiIqptuzyv2gZ+hXgRXJvODmLbpuk804JxXNeuq227PG0agXgRXJvODuI49v3JNPp+GDgG1qYRiBfBtensILS29rrSAueMkTL93b/RphGI3XJtOjsIra2d57TAOWOWpbbt8rRpBL6mwbHpRiZvyHQzynsLhP8AAAAASUVORK5CYII=)";
			    // console.log("Karma level 4");
			} else if (numPages > 8) {
				karmaImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAASEAYAAACFmmsvAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAhAAAAEgCh1htJAAAAwUlEQVRYw+2TMQrEIBBFJ4tXsBtygklpYa6WOleLhWU8QbDzCoFs4wpbDYIwu+KrLPLh5//5AAMAAJiIiIiep1YYQgghTJP0D7RCfR6IiIi8IMYYY5S23Z6XtIFfoVxEr01XB6G11lrzgpRSSknadnvGNDLlInptujqI8zyO6+IFy7Ku8yxtuz1jGplyEb02XR2EMc7dNy/w3lql+O/+jTGNTOm216argzDGuW3jBd5bu+/SttszppH5mkaPTQ8qeQM9fTc6rwl5CgAAAABJRU5ErkJggg==)";
				// console.log("Karma level 3");
			} else if (numPages > 2) {
				karmaImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAASEAYAAACFmmsvAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAhAAAAEgCh1htJAAAAvUlEQVRYw+2TMQoEIQxFM4tXEFLkCLYWnm3qOZuFrUdIEcgVBmYbV9hKBMFd8VUW8+HP//kAGwAAOJxzzrnn6RXmnHPOxzH7B0ZhPg8iIqK2gJmZebbt8bxmG/gV6kWs2nR3ENZaa21boKqqOtv2ePY0CvUiVm26OwhERMS2QEREZLbt8expFOpFrNp0dxDex3jfbUFKIRjT/u7f2NMo1G5Xbbo7CO9jPM+2IKUQrmu27fHsaRS+prFi05tO3sl5O6AL5IkjAAAAAElFTkSuQmCC)";
				// console.log("Karma level 2");
			} else if (numPages > 0) {
				karmaImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAASEAYAAACFmmsvAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAAAhAAAAEgCh1htJAAAAu0lEQVRYw+2TMQoFIQxE42evICSQI9husWfbes+2xbYeQVDIIfY3flsJCPmIr7IZGDMzAAsAAHAhhBDC+2qFMcYYo3PWHxjF9nswMzP3BSmllJK17fF8rA38C60RsyatPoT33nvfF4iIiFjbHs+aRqU1Ytak1YdARETsC0oppRRr2+NZ06i0RsyatPoQREREfUHOOedsbXs8axqV1ohZk1YfYt/v+zz7guc5juuytj2eNY1Ka8SsSS+UfAFzkz76C5DbfAAAAABJRU5ErkJggg==)";
				// console.log("Karma level 1");
			} else {
			    // console.log("Karma level 0");
			}

			infoSpan.getElementsByTagName('img')[0].style.backgroundImage = karmaImage;
			infoSpan.getElementsByTagName('a')[1].innerHTML = infoSpan.getElementsByTagName('a')[1].innerHTML + " <span style='font-size: 0.8em'>(" + numPages + " on " + lastRun + ")</span>";
		}
	}
}

let loginStatus = document.getElementById('login-status');
let myAccount = document.getElementById('my-account');

function reloadKarma() {
	let timer = setInterval(function() {
		setAuthorKarma();
		if (document.getElementsByClassName("info")[0].children[0].children[1].children.length > 0) {
			clearInterval(timer);
			document.getElementsByClassName("pager")[0].onclick = reloadKarma();
		}
	}, 500);
}

if (myAccount && rankingHTML) {
	setAuthorKarma();
	document.getElementsByClassName("pager")[0].onclick = reloadKarma();
}
