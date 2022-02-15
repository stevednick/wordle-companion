import { wordList } from "./modules/word-list.js";
import * as Basic from "./modules/basic-solver.js";
import * as TopDisplay from "./modules/display-top-words.js";

// Solver Requirements:
// setup();
// getBestWords(); returns [{word: "", score: ""} * 10]
// getNextWord(testWord, colours); Modifies inside module so getBestWords() shows next set of options.
// getCurrentWordListLength(); Returns number of remaining options.

var currentRound = -1;
var bestWords = [];
var colours = [];

var letterColours = [0, 0, 0, 0, 0];
var currentBestWord = "";
const colourClasses = ["grey", "orange", "green"];
var topWords = [];

function removeWithout(letter) {
  var listToReturn = [];
  for (var w = 0; w < currentWordList.length; w++) {
    if (currentWordList[w].includes(letter)) {
      listToReturn.push(currentWordList[w]);
    }
  }
  currentWordList = listToReturn;
}

function setup() {
  Basic.setup();
  getBestWord();
  setRemainingText();
}

function getBestWord() {
  currentRound++; // this stays
  topWords = Basic.getBestWords();
  TopDisplay.show(topWords);
  currentBestWord = topWords[0].word;
  for (var i = 0; i < 5; i++) {
    $(".box" + currentRound + " .l" + i).text(currentBestWord[i]);
    $(".box" + currentRound + " .l" + i).addClass("grey");
  }
  setRemainingText();
}

function setRemainingText() {
  $(".options-remaining").text(
    Basic.getCurrentWordListLength() + "/" + wordList.length + " remaining."
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

export function changeWord(clickedElement) {
  console.log(clickedElement);
}

$(".tile").click(function (event) {
  if ($(this).parent().attr("class")[14] == currentRound) {
    letterPressed($(this).attr("class")[6]);
  }
});

$(".go-button").click(function (event) {
  Basic.getNextWord(currentBestWord, letterColours);
  getBestWord();
  letterColours = [0, 0, 0, 0, 0];
  //currentBestWord = Basic.getBestWord(); // can these be combined into getNextWord...?
  setRemainingText();
});

setup();
