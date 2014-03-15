var chai = require('chai');
var assert = chai.assert;
var calculateLevDistance = require('../spelling-suggester.js').calculateLevDistance;
var writeSuggestions = require('../spelling-suggester.js').writeSuggestions;

suite('spelling-suggester', function() {
    /*Testing calculateLevDistance*/
    test('calculateLevDistance should return Damerau-Levenshtein distance', function() {
        assert.equal(1, calculateLevDistance("hello", "helol"));
        assert.equal(2, calculateLevDistance("babys", "babies"));
        assert.equal(3, calculateLevDistance("baeutfl", "beautiful"));
    });

    /*Testing writeSuggestions*/
    test('writeSuggestions should write the correct suggestions', function() {
        var dictionary = [['love'], ['beautiful'], ['hello']];
        var misspelled = [['loev'], ['baeutifl'], ['llohe'], ['test']];
        var expectedOutput = "* loev: ['love']\r\n* baeutifl: ['beautiful']\r\n* llohe: ['love']\r\n* test: []\r\n";
        var actualOutput = writeSuggestions(dictionary, misspelled);
        assert.equal(actualOutput, expectedOutput);
    });
});