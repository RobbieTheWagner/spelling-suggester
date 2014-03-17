# Spelling Suggester

## Info
This is a spelling suggester node.js app that I created.

It uses the npm module csv to parse two CSV files, a list of misspelled words, and another list of dictionary words. It then sorts the dictionary words by frequency of use.

After parsing the two files, and loading them into arrays, it iterates through each array, and calculates the Damerau-Levenshtein distance between the correct words in the dictionary and the misspelled words to determine which words match to be used as spelling correction suggestions.

To write my Damerau-Levenshtein function, I referenced the explanation and pseudocode on the [Wikipedia](http://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance) page. Once I implemented the basic algorithm, I reversed a couple of my for loops and changed a call to ```Math.min``` to my own written min function instead. This brought the execution time down a considerable amount.

I used Mocha for testing and Chai to do assertions. The tests are located in the test folder.

## Run
To run the app, you must have node and npm installed on your machine. If you do not, please go [here](http://nodejs.org/download/) and download node for your machine.

Once node and npm are installed, you are ready to run the app.

To run the app, simply download the zipped version of this code and unzip it. Then cd to the directory you saved it in. For example:
```bash
cd spelling-suggester-master
```

Then, all you have to do is run:
```bash
node app.js
```

You will not see any output in the terminal, but the program is running. When it completes, in ~45 seconds, it will print to the console the number of words found and the time it took to execute. Also, it will have generated a suggestions.txt file in the root of the project. You can then view that to see the suggestions for each misspelled word.

To run the tests for the app, while still in the root of the project, simply run:
```
npm test
```

This will run the tests using Mocha, and output the results.

## Questions
  1. How would the code perform if the size of the dictionary were 1 million words?
<pre>
If the size of the dictionary were 1 million words, the code would be slower, but it would only 
be a linear speed drop, so it would not be extremely slower like if it were an exponential drop 
or something. The algorithm is O(nm) worst case. Please see my answer to question 2 for more of 
an explanation.
</pre>
  2. How would the code perform with an edit distance of 3?
<pre>
When I change the edit distance to 3, the number of words found goes up from 4895 to 42730. 
So that is almost 10x the words. However, the execution time only goes up ~2 seconds from 
45.639 to 47.272. The time complexity of Damerau-Levenshtein is O(nm) in the worst case 
(with n and m being the number of characters in each word), so if we assume worst case 
for all misspelled words in the list (M being the count of words in the misspelled list and D 
being the count of words in the dictionary), it would just be O(MDnm), which simplifies again 
to being just O(nm).
</pre>
  3. How does the code perform on long queries versus short queries and why?
<pre>
Once again, with the algorithm being O(nm), the code will execute linearly proportional to 
the number of letters in each of the words being looked at. Short queries will take less time, 
and long queries will take more time, but the difference should be minimal. For example, if 
you compare just "a" and "b" it would be done immediately and return 1, but if you compare longer 
words, it will take time proportional to the size of the words. It is negligible though since it is linear.
</pre>
