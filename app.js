/*Requiring libraries*/
var csv = require('csv');
var fs = require('fs');

/*Variables*/
var misspelledWords;

/*Parse the csv and return and array of misspelled words*/
function getMisspelledWords(callback) {
    csv().from.stream(fs.createReadStream(__dirname + '/misspelled_queries.csv')).to.array(function (data) {
            callback(data);
        });
}

/*Parse the csv and return an array of dictionary words in descending order by frequency*/
function sortWords(callback) {
    csv().from.stream(fs.createReadStream(__dirname + '/word_frequency.csv')).to.array(function (data) {
        data.sort(function (a, b) {
            return b[1] - a[1];
        });
        //return data;
        callback(data);
    });
}


getMisspelledWords(function(test){
   //console.log(test);
});

sortWords(function(test){
    //console.log(test);
})


//.to.path(__dirname+'/suggestions.txt')
/*.transform( function(row){
 row.unshift(row.pop());
 return row;
 })
 .on('record', function(row,index){
 console.log('#'+index+' '+JSON.stringify(row));
 })
 .on('end', function(count){
 console.log('Number of lines: '+count);
 })
 .on('error', function(error){
 console.log(error.message);
 });*/


function determineAlternates(word) {
    var i, results = [];
    // deletion
    for (i = 0; i < word.length; i++)
        results.push(word.slice(0, i) + word.slice(i + 1));
    // transposition
    for (i = 0; i < word.length - 1; i++)
        results.push(word.slice(0, i) + word.slice(i + 1, i + 2) + word.slice(i, i + 1) + word.slice(i + 2));
    // alteration
    for (i = 0; i < word.length; i++)
        speller.letters.forEach(function (l) {
            results.push(word.slice(0, i) + l + word.slice(i + 1));
        });
    // insertion
    for (i = 0; i <= word.length; i++)
        speller.letters.forEach(function (l) {
            results.push(word.slice(0, i) + l + word.slice(i));
        });
    return results;
};