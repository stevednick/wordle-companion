import { wordList } from "../modules/word-list.js";

// Solver Requirements:
// setup();
// getBestWords(); returns [{word: "", score: ""} * 10]
// getNextWord(testWord, colours); Modifies inside module so getBestWords() shows next set of options.
// getCurrentWordListLength(); Returns number of remaining options.
// reset();

var currentWordList = [...wordList];
const letters = "abcdefghijklmnopqrstuvwxyz";

function word(word) {
  // for a particular word you only need to get the comparison colours once.
  // some sorting algorithm to get the count of each? Maybe do during assembly of possibilities?

  this.word = word;
  this.possibilites;
  this.score = 0; // this is the number that matters. how to get this without running through everything twice?
  this.setup = () => {
    this.possibilites = getPossibilities(); // set these up
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
  // this.getCount = (word) => {
  //   // how to make this way fucking quicker?
  //   for (const w of currentWordList) {
  //     var include = true;
  //     const wColours = assignColours(word, w);
  //     for (var i = 0; i < 5; i++) {
  //       if (wColours[i] != colours[i]) include = false;
  //     }
  //     if (include) this.count++;
  //   }
  // };
}

export function getBestWords() {
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

export function test() {
  // const top = getBestWords();
  // alert(top[0].word);
  //alert(w.possibilites[0]);
}

function calculateScore(word) {}

function getPossibilities() {
  // Note! Plan is to send in the currentWordList,
  // and while assembly of list is taking place
  // it gradually refines the list to match the colours.
  // And then sends the length of the list to the possibility when assembling.
  // therefore (hopefully) saving a fuck load of time.
  // if this works I am a clever little shit.

  var allPossibilities = [];
  next([], 0, currentWordList); // Send in an empty array to be populated with the options and the first index.
  function next(current, index, words) {
    if (index === 5) {
      // if index == 5 then array should have 5 digits in it.
      allPossibilities.push(new possibility(current, 7)); // append array to allPossibilities.
      return; // break this particular line in the stack.
    }
    for (var i = 0; i < 3; i++) {
      next([...current, i], index + 1);
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
