//Requires
var parseCsvs = require('./spelling-suggester.js').parseCsvs;
var writeSuggestions = require('./spelling-suggester.js').writeSuggestions;

//Running the program
parseCsvs(writeSuggestions);