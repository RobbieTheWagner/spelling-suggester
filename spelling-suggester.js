/*Requiring libraries*/
var csv = require('csv');
var fs = require('fs');

var start = new Date().getTime();
var numWords = 0;

/*Parse the csvs and return an array of dictionary words in descending order by frequency and an array of misspelled words.*/
function parseCsvs(callback) {
    csv().from.stream(fs.createReadStream(__dirname + '/word_frequency.csv')).to.array(function (dictionary) {
        dictionary.sort(function (a, b) {
            return b[1] - a[1];
        });
        csv().from.stream(fs.createReadStream(__dirname + '/misspelled_queries.csv')).to.array(function (misspelled) {
            var stream = fs.createWriteStream("suggestions.txt");
            stream.write(callback(dictionary, misspelled));
            stream.end();
            var end = new Date().getTime();
            console.log("Word matches: " + numWords);
            console.log("Time: " + (end - start) / 1000);
        });
    });
}

function calculateLevDistance(word1, word2) {
    //Holds the distance between the first i characters of word1 and the first j characters of word2.
    var distances = [];
    var word1Length = word1.length;
    var word2Length = word2.length;
    var cost;
    //Initialize array
    while (distances.push([]) <= word1Length);
    //Populate array
    var i = word1Length + 1;
    while (i--) {
        distances[i][0] = i;
    }
    var j = word2Length + 1;
    while (j--) {
        distances[0][j] = j;
    }

    for (i = 1; i <= word1Length; i++) {
        for (j = 1; j <= word2Length; j++) {

            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                cost = 0;
            }
            else {
                cost = 1;
            }
            var deletion = distances[i - 1][j] + 1;
            var insertion = distances[i][j - 1] + 1;
            var substitution = distances[i - 1][j - 1] + cost;
            distances[i][j] = Math.min(deletion, insertion, substitution);

            if (i > 1 && j > 1 && word1.charAt(i - 1) == word2.charAt(j - 2) && word1.charAt(i - 2) == word2.charAt(j - 1)) {
                distances[i][j] = Math.min(distances[i][j], distances[i - 2][j - 2] + cost);
            }
        }
    }
    return distances[word1Length][word2Length];
}

/* This function takes a dictionary array of correctly spelled words, previously sorted by their frequency of use,
 * and an array of misspelled words to determine suggestions for. It then takes each misspelled word and calculates the
 * Damerau-Levenshtein distance between it and the dictionary words to determine matches.
 * */
function writeSuggestions(dictionary, misspelled) {
    var writeString = "";
    for (var i = 0; i < misspelled.length; i++) {
        var misspelledWord = misspelled[i][0];
        writeString += "* " + misspelledWord + ": [";
        var writeExtraBracket = true;
        for (var j = 0; j < dictionary.length; j++) {
            var correctWord = dictionary[j][0];
            if (calculateLevDistance(misspelledWord, correctWord) <= 2) {
                writeString += "'" + correctWord + "'" + ",";
                numWords++;
                writeExtraBracket = false;
            }
        }
        if (!writeExtraBracket) {
            writeString = writeString.substring(0, writeString.length - 1);
        }
        writeString += "]\r\n";
    }
    return writeString;
}

exports.calculateLevDistance = calculateLevDistance;
exports.writeSuggestions = writeSuggestions;
exports.parseCsvs = parseCsvs;