import { wordList } from "../modules/word-list.js";
import { returnColoursAndGetNextWord } from "../index.js";

let answerToBeTested = "freak";
let results = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function assignColours(guess) {
  let colours = [0, 0, 0, 0, 0];
  let answerLetters = [...answerToBeTested];

  for (var i = 0; i < 5; i++) {
    if (answerLetters[i] == guess[i]) {
      answerLetters[i] = "0";
      colours[i] = 2;
    }
  }
  for (var j = 0; j < 5; j++) {
    if (colours[j] > 0) continue;
    if (answerLetters.includes(guess[j])) {
      answerLetters[answerLetters.indexOf(guess[j])] = "0";
      colours[j] = 1;
    }
  }
  return colours;
}

export function testWord(wordToTest, firstGuess) {
  answerToBeTested = wordToTest;
  var guess = firstGuess;
  for (var i = 0; i < results.length; i++) {
    if (guess == answerToBeTested) {
      alert(`${i + 1} guesses!`);
      break;
    }
    guess = returnColoursAndGetNextWord(assignColours(guess));
  }
}

// Take word to be tested.
// Ask Solver for bestWords
// Return correct colours.
// Get next word. until solved.
// Keep score.
