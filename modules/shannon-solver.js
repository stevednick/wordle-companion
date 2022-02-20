import { wordList } from "../modules/word-list.js";

// Solver Requirements:
// setup();
// getBestWords(); returns [{word: "", score: ""} * 10]
// getNextWord(testWord, colours); Modifies inside module so getBestWords() shows next set of options.
// getCurrentWordListLength(); Returns number of remaining options.
// reset();

var currentWordList = [...wordList];
const letters = "abcdefghijklmnopqrstuvwxyz";

function testWord(word, used = [0, 0, 0, 0, 0]) {
  // which fecking way around?
  this.word = word;
  this.used = used;
  this.checkIfValid = (guess, pos, colour) => {
    if (colour === 0 && this.word.includes(guess[pos])) return false;
    if (colour === 1) {
      if (this.word[pos] === guess[pos]) return false;
      return this.checkForUnusedSlot(guess[pos]);
    }
    if (colour === 2) {
      if (this.word[pos] === guess[pos]) {
        if (this.used[pos] === 0) {
          this.used[pos] = 1;
          return true;
        } else {
          return this.checkForUnusedSlot(guess[pos]);
        }
      }
      return false;
    }
    return true;
  };
  this.checkForUnusedSlot = (letter) => {
    for (var i = 0; i < 5; i++) {
      if (this.word[i] == letter && this.used[i] === 0) {
        this.used[i] = 1;
        return true;
      }
    }
    return false;
  };
}

function word(word) {
  // for a particular word you only need to get the comparison colours once.
  // some sorting algorithm to get the count of each? Maybe do during assembly of possibilities?

  this.word = word;
  this.possibilites;
  this.score = 0; // this is the number that matters. how to get this without running through everything twice?
  this.setup = () => {
    this.possibilites = getPossibilities(this.word); // set these up

    for (const pos of this.possibilites) {
      //pos.getCount(this.word);
      if (pos.count > 0) this.score += pos.bits();
    }
  };
}

function possibility(colours, count) {
  this.colours = colours;
  this.count = count;
  this.probability = () => this.count / currentWordList.length;
  this.bits = () => this.probability() * Math.log2(1.0 / this.probability());
}

export function setup() {}

export function getBestWords(firstRound = false) {
  if (firstRound) {
    return [
      { word: "tares", score: 6.194 },
      { word: "lares", score: 6.15 },
      { word: "rales", score: 6.114 },
      { word: "rates", score: 6.1 },
      { word: "teras", score: 6.08 },
      { word: "nares", score: 6.07 },
      { word: "soare", score: 6.06 },
      { word: "tales", score: 6.05 },
      { word: "reais", score: 6.05 },
      { word: "tears", score: 6.03 },
    ];
  }
  const wordList = [];
  const scores = [];
  const top10 = [];
  for (const nextWord of currentWordList) {
    const w = new word(nextWord);
    w.setup();
    wordList.push(w.word);
    scores.push(w.score);
  }
  for (var i = 0; i < 10; i++) {
    if (scores.length == 0) break;
    var bestIndex = scores.indexOf(Math.max(...scores));
    top10.push({
      word: wordList[bestIndex],
      score: Math.max(...scores),
    });
    wordList.splice(bestIndex, 1);
    scores.splice(bestIndex, 1);
  }
  return top10;
}

export function getNextWord(testWord, colours) {
  const newWordList = [];
  for (const w of currentWordList) {
    if (checkIfValid(testWord, guess, colours)) newWordList.push(w);
  }
  currentWordList = [...newWordList];
  function checkIfValid(guess, word, colours) {
    const used = [0, 0, 0, 0, 0];
    for (var pos = 0; pos < 5; pos++) {
      for (const colour of colours) {
        if (colour === 0 && word.includes(guess[pos])) return false;
        if (colour === 1) {
          if (word[pos] === guess[pos]) return false;
          if (!checkForUnusedSlot(guess[pos])) return false;
        }
        if (colour === 2) {
          if (word[pos] === guess[pos]) {
            if (used[pos] === 0) {
              used[pos] = 1;
              continue;
            } else {
              return checkForUnusedSlot(guess[pos]);
            }
          }
        }
      }
    }

    function checkForUnusedSlot(letter) {
      // integrate this
      for (var i = 0; i < 5; i++) {
        if (word[i] == letter && used[i] === 0) {
          used[i] = 1;
          return true;
        }
      }
      return false;
    }

    return true;
  }
}

function calculateScore(word) {}

function getPossibilities(guess) {
  // Note! Plan is to send in the currentWordList,
  // and while assembly of list is taking place
  // it gradually refines the list to match the colours.
  // And then sends the length of the list to the possibility when assembling.
  // therefore (hopefully) saving a fuck load of time.
  // if this works I am a clever little shit.

  var allPossibilities = [];
  const wordList = [];
  for (const w of currentWordList) wordList.push(new testWord(w));
  next([], 0, wordList); // Send in an empty array to be populated with the options and the first index.
  function next(current, index, words) {
    if (words.length == 0) return;
    if (index === 5) {
      // if index == 5 then array should have 5 digits in it.
      allPossibilities.push(new possibility(current, words.length)); // append array to allPossibilities.
      return; // break this particular line in the stack.
    }
    for (var i = 0; i < 3; i++) {
      const newList = [];
      for (const w of words) {
        const word = new testWord(w.word, w.used);
        if (word.checkIfValid(guess, index, i)) newList.push(word);
      }
      next([...current, i], index + 1, newList);
    }
  }
  return allPossibilities;
}

function assignColours(word, wordToBeTested) {
  let colours = [0, 0, 0, 0, 0];
  let answerLetters = [...wordToBeTested];

  for (var i = 0; i < 5; i++) {
    if (answerLetters[i] == word[i]) {
      answerLetters[i] = "0";
      colours[i] = 2;
    }
  }
  for (var j = 0; j < 5; j++) {
    if (colours[j] > 0) continue;
    if (answerLetters.includes(word[j])) {
      answerLetters[answerLetters.indexOf(word[j])] = "0";
      colours[j] = 1;
    }
  }
  return colours;
}

export function getCurrentWordListLength() {
  return currentWordList.length;
}
