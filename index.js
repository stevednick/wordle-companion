import { wordList } from "./modules/word-list.js";
import * as Solver from "./modules/basic-solver.js";
import * as TopDisplay from "./modules/display-top-words.js";
import * as TestSuite from "./modules/test-suite.js";

// Solver Requirements:
// setup();
// getBestWords(); returns [{word: "", score: ""} * 10]
// getNextWord(testWord, colours); Modifies inside module so getBestWords() shows next set of options.
// getCurrentWordListLength(); Returns number of remaining options.
// reset();

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
  Solver.setup();
  getBestWord();
  setRemainingText();
}

function getBestWord() {
  currentRound++; // this stays
  topWords = Solver.getBestWords();
  TopDisplay.show(topWords);
  currentBestWord = topWords[0].word;
  setLetters(currentBestWord);
  setRemainingText();
}

function getNextWord() {
  Solver.getNextWord(currentBestWord, letterColours);
  getBestWord();
  letterColours = [0, 0, 0, 0, 0];
  //currentBestWord = Basic.getBestWord(); // can these be combined into getNextWord...?
  setRemainingText();
}

function setLetters(word) {
  for (var i = 0; i < 5; i++) {
    $(".box" + currentRound + " .l" + i).text(currentBestWord[i]);
    $(".box" + currentRound + " .l" + i).addClass("grey");
  }
}

function setRemainingText() {
  $(".options-remaining").text(
    Solver.getCurrentWordListLength() + "/" + wordList.length + " remaining."
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

export function changeWord(newWord) {
  currentBestWord = newWord;
  setLetters(currentBestWord);
}

export function returnColoursAndGetNextWord(colours) {
  setColoursFromTest(colours);
  getNextWord();
  return currentBestWord;
}

$(".tile").click(function (event) {
  if ($(this).parent().attr("class")[14] == currentRound) {
    letterPressed($(this).attr("class")[6]);
  }
});
function setColoursFromTest(newColours) {
  letterColours = newColours;
  resetColours();
  for (var i = 0; i < 5; i++) {
    $(".box" + currentRound + " .l" + i).addClass(
      colourClasses[letterColours[i]]
    );
  }
}

$(".go-button").click(function (event) {
  if ($(".test-word-input").val().length == 5) {
    reset();
    TestSuite.testWord($(".test-word-input").val(), currentBestWord);
    return;
  }
  getNextWord();
});

function reset() {
  Solver.reset();

  currentRound = -1;
  bestWords = [];
  colours = [];
  letterColours = [0, 0, 0, 0, 0];
  currentBestWord = "";
  topWords = [];
  setup();

  resetColours();
}

setup();
