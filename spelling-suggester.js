//Requires
var csv = require('csv');
var fs = require('fs');

//The time that execution is started.
var start = new Date().getTime();
//The number of correct words matched to the misspelled words.
var numWords = 0;

/*This function uses the npm module csv to parse the two csv files and load them into arrays.
 * It then sorts the dictionary array by the frequency of use of each word.
 * Finally, it calls the callback function, which in our case is writeSuggestions, and writes the output
 * to a file named suggestions.txt.
 *
 * @param callback The function to call as the callback.
 * @author Robert Wagner (rwwagner90)
 * */
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

/*This function returns the Damerau-Levenshtein distance between two given words.
 *
 * @param word1 The first word to compare.
 * @param word2 The second word to compare.
 * @return An int representing the Damerau-Levenshtein distance.
 * @author Robert Wagner (rwwagner90)
 * */
function calculateLevDistance(word1, word2) {
    //Holds the distance between the first i characters of word1 and the first j characters of word2.
    var distances = [];
    var word1Length = word1.length;
    var word2Length = word2.length;
    var cost;
    if(word1Length == 0)
    {
        return word2Length;
    }
    else if(word2Length == 0)
    {
        return word1Length;
    }
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
            distances[i][j] = min(substitution, min(deletion, insertion));

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
 *
 * @param dictionary The array of correct words sorted by frequency of use.
 * @param misspelled The array of misspelled words.
 * @return The string to write to the suggestions.txt file.
 * @author Robert Wagner (rwwagner90)
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

/*This function calculates the min of two numbers
*
* @param number1 The first number to compare.
* @param number2 The second number to compare.
* @return The least of the two numbers.
* @author Robert Wagner (rwwagner90)
* */
function min(number1, number2) {
    return number1 < number2 ? number1 : number2;
}

//Exports
exports.calculateLevDistance = calculateLevDistance;
exports.writeSuggestions = writeSuggestions;
exports.min = min;
exports.parseCsvs = parseCsvs;