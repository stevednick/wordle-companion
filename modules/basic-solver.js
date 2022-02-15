import { wordList } from "../modules/word-list.js";

function letter(character) {
  this.character = character;
  this.minInWord = 0;
  this.positions = [];
  this.notPossible = [];
}

const letters = "abcdefghijklmnopqrstuvwxyz";
var currentLetters = [];
var currentWordList = wordList;
export const getCurrentWordListLength = () => currentWordList.length;

export function setup() {
  for (const l of letters) {
    currentLetters.push(new letter(l));
  }
}

export function getBestWords() {
  var topWords = getTopWords();
  return topWords;
}

export function getNextWord(bestWord, colours) {
  // send in array of colours
  resetLetterCounts();
  var word = bestWord;

  for (var p = 0; p < 5; p++) {
    var l = letters.indexOf(word[p]);
    switch (colours[p]) {
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
    if (colours[r] == 0 && currentLetters[l].minInWord == 0) {
      currentLetters[l].notPossible = [0, 1, 2, 3, 4];
    }
  }
  //resetColours(-1, true);
  //colours = [0, 0, 0, 0, 0];
  sortList();
}

function getTopWords() {
  var letterCounts = getLetterCounts();
  var wordList = [];
  var wordScores = [];
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

  for (var i = 0; i < 10; i++) {
    if (wordScores.length == 0) break;
    var bestIndex = wordScores.indexOf(Math.max(...wordScores));
    wordList.push({
      word: currentWordList[bestIndex],
      score: Math.max(...wordScores),
    });
    currentWordList.splice(bestIndex, 1);
    wordScores.splice(bestIndex, 1);
  }
  return wordList;
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
}

function keepLetter(letter, position) {
  var listToReturn = [];
  for (var w = 0; w < currentWordList.length; w++) {
    if (currentWordList[w].charAt(position) == letter) {
      listToReturn.push(currentWordList[w]);
    }
  }
  currentWordList = listToReturn;
}

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
}

function resetLetterCounts() {
  for (var i = 0; i < currentLetters.length; i++) {
    currentLetters[i].minInWord = 0;
  }
}

function makeUnique(str) {
  return String.prototype.concat(...new Set(str));
}
