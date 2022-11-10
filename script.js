import { wordlist as checkWordList } from "./word.js";

const keyboard = document.querySelector(".keyboard");
const message = document.querySelector(".message");
const title = document.querySelector(".title");

const alphabet = "abcdefghijklmnopqrstuvwxyz";
//const checkWordList = wordlist;
//const checkWordList = ["PEARS", "GRAIN", "PAINT", "RAINY", "ENTER", "SHIFT"];
let currentWord;
const maxRow = 6;
const maxBox = 5;
let currentrow;
let currentBox;
let currentCell;
let state;

const getCurrentCell = function (currentrow, currentBox) {
  return document
    .querySelector(`.row-${currentrow}`)
    .querySelector(`.box[data-box="${currentBox}"]`);
};

const init = function () {
  currentWord = checkWordList[Math.floor(Math.random() * checkWordList.length)];
  currentrow = 1;
  currentBox = 1;
  state = true;
  alphabet.split("").forEach((ele) => {
    const initEle = document.querySelector(
      `button[data-key="${ele.toUpperCase()}"]`
    );
    initEle.style.backgroundColor = "#f0f0f0";
    initEle.style.borderColor = "#f0f0f0";
  });
  for (let i = 1; i < 7; i++) {
    for (let j = 1; j < 6; j++) {
      const initBox = getCurrentCell(i, j);
      initBox.textContent = "";
      initBox.style.backgroundColor = "white";
      initBox.style.borderColor = "#c5c5c5";
      initBox.style.transform = "rotateY(0deg)";
    }
  }
};

init();

const showLetter = function (word) {
  if (currentBox > maxBox) return;
  currentCell = getCurrentCell(currentrow, currentBox);
  if (currentCell.textContent) return;
  currentCell.textContent = word;
  currentCell.style.borderColor = "black";
  if (currentBox < maxBox) currentBox++;
};

const removeLetter = function () {
  currentCell = getCurrentCell(currentrow, currentBox);
  if (currentCell.textContent === "") {
    if (currentBox === 1) return;
    currentBox--;
    removeLetter();
  }
  currentCell.textContent = "";
  currentCell.style.borderColor = "#c5c5c5";
};

const showError = function (messageToShow) {
  message.classList.remove("hidden");
  const thisRow = document.querySelector(`.row-${currentrow}`);
  thisRow.classList.add("shake");
  message.textContent = messageToShow;
  setTimeout(() => {
    message.classList.add("hidden");
    thisRow.classList.remove("shake");
  }, 2000);
};

const changeState = function (ele, i, color) {
  const cellToChange = getCurrentCell(currentrow, i + 1);
  const keyColorChange = document.querySelector(`button[data-key="${ele}"]`);
  cellToChange.style.backgroundColor = `${color}`;
  cellToChange.style.borderColor = `${color}`;
  keyColorChange.style.backgroundColor = `${color}`;
  keyColorChange.style.borderColor = `${color}`;
  cellToChange.style.transform = "rotateY(360deg)";
};

const checkCorrectWord = function (wordArray) {
  const correctArray = currentWord.split("");
  let correctWordCount = 0;
  // console.log(wordArray, correctArray);
  wordArray.forEach((element, i) => {
    if (element === correctArray[i]) {
      changeState(element, i, "green");
      correctWordCount++;
    } else if (element !== correctArray[i] && correctArray.includes(element)) {
      changeState(element, i, "brown");
    } else {
      changeState(element, i, "grey");
    }
  });
  if (correctWordCount < 5) {
    if (currentrow <= maxRow) {
      currentrow++;
      if (currentrow >= maxRow + 1) {
        state = false;
        message.classList.remove("hidden");
        message.textContent = `Correct Word: ${currentWord}`;
      }
      currentBox = 1;
    }
  } else if (correctWordCount === 5) {
    state = false;
  }
};

const checkWord = function () {
  const checkArray = [];
  for (let i = 1; i <= 5; i++) {
    const fillWord = getCurrentCell(currentrow, i).textContent;
    if (!fillWord) continue;
    checkArray.push(fillWord);
  }
  //console.log(checkArray);
  if (checkArray.length < 5) {
    showError("Not Enough Letters!");
    return;
  }
  if (!checkWordList.includes(checkArray.join(""))) {
    showError("Word not found!");
    return;
  }
  checkCorrectWord(checkArray);
};

//Event Listeners
keyboard.addEventListener("click", function (e) {
  const key = e.target;
  if (state) {
    if (
      key.classList.contains("keys") &&
      !key.classList.contains("enter") &&
      !key.classList.contains("backspace")
    ) {
      showLetter(key.textContent, currentBox);
    }
    if (key.classList.contains("backspace")) {
      removeLetter();
    }
    if (key.classList.contains("enter")) {
      checkWord();
    }
  }
});

window.addEventListener("keydown", function (e) {
  const key = e.key;
  if (state) {
    if (alphabet.split("").includes(key)) {
      showLetter(key.toUpperCase(), currentBox);
    }
    if (key === "Backspace") {
      removeLetter();
    }
    if (key === "Enter") {
      checkWord();
    }
  }
});

title.addEventListener("click", function (e) {
  message.classList.remove("hidden");
  message.textContent = `Correct Word: ${currentWord}`;
  setTimeout(() => {
    message.classList.add("hidden");
    init();
  }, 1500);
});
