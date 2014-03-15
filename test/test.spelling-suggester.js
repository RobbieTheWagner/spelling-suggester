//Requires
var chai = require('chai');
var assert = chai.assert;
var spellingSuggester = require('../spelling-suggester.js');
var calculateLevDistance = spellingSuggester.calculateLevDistance;
var writeSuggestions = spellingSuggester.writeSuggestions;
var min = spellingSuggester.min;

//Test suites
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
        assert.equal(expectedOutput, actualOutput);
    });

    /*Testing min*/
    test('min should return the minimum of the two numbers given', function() {
        assert.equal(2, min(5,2));
    });
});