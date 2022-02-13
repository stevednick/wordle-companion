import { wordList } from "./word-list.js";

function letter(character) {
  this.character = character;
  this.minInWord = 0;
  this.positions = [];
  this.notPossible = [];
}

var currentRound = -1;
var bestWords = [];
var colours = [];
var currentWordList = wordList;
const letters = "abcdefghijklmnopqrstuvwxyz";
var currentLetters = [];
var letterColours = [0, 0, 0, 0, 0];
var currentBestWord = "";
const colourClasses = ["grey", "orange", "green"];

function setup() {
  for (const l of letters) {
    currentLetters.push(new letter(l));
  }
  // for (i = 0; i < letters.length; i++) {
  //   currentLetters.push(new letter(letters[i]));
  // }
}
setup();

function getLetterCounts() {
  var letterCounts = [];
  for (var l = 0; l < letters.length; l++) {
    var tally = 0;
    for (var w = 0; w < currentWordList.length; w++) {
      var ch = letters[l];
      var count = currentWordList[w].split(ch).length - 1;
      tally += count;
    }
    letterCounts.push(tally);
  }
  return letterCounts;
}

function removeLetter(letter, position = -1) {
  var listToReturn = [];
  for (var w = 0; w < currentWordList.length; w++) {
    if (position < 0 && !currentWordList[w].includes(letter)) {
      listToReturn.push(currentWordList[w]);
    } else if (position >= 0) {
      if (!(currentWordList[w].charAt(position) == letter)) {
        listToReturn.push(currentWordList[w]);
      }
    }
  }
  currentWordList = listToReturn;
  setRemainingText();
}

function keepLetter(letter, position) {
  var listToReturn = [];
  for (var w = 0; w < currentWordList.length; w++) {
    if (currentWordList[w].charAt(position) == letter) {
      listToReturn.push(currentWordList[w]);
    }
  }
  currentWordList = listToReturn;
  setRemainingText();
}

function removeWithout(letter) {
  var listToReturn = [];
  for (var w = 0; w < currentWordList.length; w++) {
    if (currentWordList[w].includes(letter)) {
      listToReturn.push(currentWordList[w]);
    }
  }
  currentWordList = listToReturn;
  setRemainingText();
}

function minimumNumber(letter, count) {
  var listToReturn = [];
  for (var i = 0; i < currentWordList.length; i++) {
    if (
      (currentWordList[i].match(new RegExp(letter, "g")) || []).length >= count
    ) {
      listToReturn.push(currentWordList[i]);
    }
  }
  currentWordList = listToReturn;
  setRemainingText();
}

function getBestWord() {
  currentRound++;
  var wordScores = [];
  var letterCounts = getLetterCounts();
  for (var w = 0; w < currentWordList.length; w++) {
    var score = 0;
    for (var l = 0; l < 5; l++) {
      var letterToCheck = currentWordList[w][l];
      if (currentLetters[letters.indexOf(letterToCheck)].minInWord == 0) {
        score += letterCounts[letters.indexOf(letterToCheck)];
      }
    }
    var uniques = makeUnique(currentWordList[w]);

    wordScores.push(score * uniques.length);
  }
  currentBestWord =
    currentWordList[wordScores.indexOf(Math.max(...wordScores))];
  for (var i = 0; i < 5; i++) {
    $(".box" + currentRound + " .l" + i).text(currentBestWord[i]);
    $(".box" + currentRound + " .l" + i).addClass("grey");
  }

  //return currentWordList[wordScores.indexOf(Math.max(...wordScores))];
}

function setRemainingText() {
  $(".options-remaining").text(
    currentWordList.length + "/" + wordList.length + " remaining."
  );
}

function letterPressed(letter) {
  letterColours[letter] += 1;
  if (letterColours[letter] >= 3) {
    letterColours[letter] = 0;
  }
  resetColours();
  for (var i = 0; i < 5; i++) {
    $(".box" + currentRound + " .l" + i).addClass(
      colourClasses[letterColours[i]]
    );
  }
}

function resetColours(letter = -1, makeGrey = false) {
  var lettersToReset = [0, 1, 2, 3, 4];
  if (letter >= 0) {
    lettersToReset = [letter];
  }
  for (var l = 0; l < lettersToReset.length; l++) {
    for (var c = 0; c < colourClasses.length; c++) {
      $(".box" + currentRound + " .l" + lettersToReset[l]).removeClass(
        colourClasses[c]
      );
      if (makeGrey) $(".l" + lettersToReset[l]).addClass(colourClasses[0]);
    }
  }
}

function makeUnique(str) {
  return String.prototype.concat(...new Set(str));
}

$(".tile").click(function (event) {
  if ($(this).parent().attr("class")[14] == currentRound) {
    letterPressed($(this).attr("class")[6]);
  }
});

$(".go-button").click(function (event) {
  getNextWord();
  getBestWord();
});

function getNextWord() {
  resetLetterCounts();
  // obtain all letters, positions and quantities.

  var word = currentBestWord;
  for (var p = 0; p < 5; p++) {
    var l = letters.indexOf(word[p]);
    switch (letterColours[p]) {
      case 0:
        break;
      case 1:
        currentLetters[l].notPossible.push(p);
        currentLetters[l].minInWord += 1;
        break;
      case 2:
        currentLetters[l].positions.push(p);
        currentLetters[l].minInWord += 1;
        break;
      default:
    }
  }
  for (var r = 0; r < 5; r++) {
    var l = letters.indexOf(word[r]);
    if (letterColours[r] == 0 && currentLetters[l].minInWord == 0) {
      currentLetters[l].notPossible = [0, 1, 2, 3, 4];
    }
  }
  //resetColours(-1, true);
  letterColours = [0, 0, 0, 0, 0];
  sortList();
}

function sortList() {
  currentWordList = wordList;
  for (var x = 0; x < letters.length; x++) {
    for (var y = 0; y < currentLetters[x].notPossible.length; y++) {
      removeLetter(letters[x], currentLetters[x].notPossible[y]);
    }
    for (var y = 0; y < currentLetters[x].positions.length; y++) {
      keepLetter(letters[x], currentLetters[x].positions[y]);
    }
    if (currentLetters[x].minInWord > 0) {
      minimumNumber(letters[x], currentLetters[x].minInWord);
    }
  }
}

function resetLetterCounts() {
  for (var i = 0; i < currentLetters.length; i++) {
    currentLetters[i].minInWord = 0;
  }
}

resetColours(-1);
getBestWord();
setRemainingText();
//displayLetters();
