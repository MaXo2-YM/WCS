'use strict'
function isAPalindrome(str)
{
	let reponse;
	if(str.length > 2)
	{
		reponse = true;
		for(let i=0; (i < (Math.trunc(str.length / 2))) && (reponse !== false); i++)
		{
			if(str[i] !== str[str.length - 1 - i])
			{
				reponse = false;
			}
		}
	}
	else {
		reponse = false;
	}
	return reponse;
}

const assert = require('assert')

console.log("--   TESTS START  --")
assert.strictEqual(isAPalindrome("bob"), true)
console.log("-- 1ER TEST  : OK --")
assert.strictEqual(isAPalindrome("kayak"), true)
console.log("-- 2EME TEST : OK --")
assert.strictEqual(isAPalindrome("palme"), false)
console.log("-- 3EME TEST : OK --")
assert.strictEqual(isAPalindrome("nn"), false)
console.log("-- 4EME TEST : OK --")
assert.strictEqual(isAPalindrome("a"), false)
console.log("-- 5EME TEST : OK --")
console.log("--   TESTS DONE   --")
