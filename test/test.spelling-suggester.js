var assert = require('assert')
var calculateLevDistance = require('../app.js').calculateLevDistance;

suite('spelling-suggester', function() {
    test('calculateLevDistance should return Damerau-Levenshtein distance', function() {
        assert.equal(1, calculateLevDistance("hello", "helol"));
        assert.equal(2, calculateLevDistance("babys", "babies"));
        assert.equal(3, calculateLevDistance("baeutfl", "beautiful"));
    });


    /*test('zero and one are not prime numbers', function() {
        assert.equal(2, nextPrime(0));
        assert.equal(2, nextPrime(1));
    });*/
});