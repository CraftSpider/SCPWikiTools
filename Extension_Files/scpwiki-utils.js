/*
SCP-Wiki Utils
version 1.0
2017-1-27 by CraftSpider

--------------------------------------------------------------------
This is a Chrome Extension script.

To install, either in chrome on the top right select the More Tools/Extensions
drop down, or navigate to chrome://Extensions, and drop the folder this
file is contained within onto that page.

To uninstall, go to More Tools/Extensions,
select "SCP Wiki Tools", and click Uninstall.
--------------------------------------------------------------------
*/
"use strict";

/*
 * Adds padding of a specific character to the beginning of a string
 *
 * Usage: myString.lpad(char, len)
 * Returns: string, the string the function is applied to, with the given padding added till the string length is equal
 *          to the passed length
 */
String.prototype.lpad = function(padding, length) {
    let str = this;
    while (str.length < length) {
        str = padding + str;
    }
    return str;
};

/*
 * Merges multiple items into one item in an array. If values are numeric, adds them. If values are  strings, concatenates them. If values are mixed, will add concurrent numeric values and concatenate when encountering a string.
 *
 * Usage: Array.mergeItems(start, stop)
 * Returns: array, the array the function has been applied to, with all items between and including start
 *          and stop merged into one new item
 */
Array.prototype.mergeItems = function (start, stop) {
    let newItem;
    if (!isNaN(parseFloat(this[start])) && isFinite(this[start])) {
        newItem = 0;
    } else {
        newItem = "";
    }
    for (x = start; x <= stop; x++) {
        //console.log('Item #' + x + ' = ' + this[x]);
        newItem = newItem + this[x];
        //console.log('newItem = ' + newItem);
    }

    this.splice(start, ((stop - start) + 1));
    //console.log('[' + this.join(', ') + ']');
    this.splice(start, 0, newItem);
    return this;
};

/*
 * Checks to see if a value is numeric without the pitfalls of isNumeric
 *
 * Usage: isNumber(value)
 * Returns: boolean true if numeric, boolean false if not numeric
 */
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
