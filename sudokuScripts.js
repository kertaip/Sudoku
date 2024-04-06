var sudokuPuzzles = [
  [
    '1',
    '...81.....2........1.9..7...7..25.934.2............5...975.....563.....4......68.',
    '0',
    'Easy',
  ],
  [
    '2',
    '........5.2...9....9..2...373..481.....36....58....4...1...358...42.......978...2',
    '1.4',
    'Easy',
  ],
  [
    '3',
    '.4.1..............653.....1.8.9..74...24..91.......2.8...562....1..7..6...4..1..3',
    '1.1',
    'Easy',
  ],
  [
    '4',
    '5...634.....7.....1...5.83.....18..7..69......43...9...............7..2.32.64.5..',
    '0',
    'Easy',
  ],
  [
    '5',
    '..346..2..58.2...1.2.9...8...1....9.2..783.........3....9..6..........56.6..7.21.',
    '0',
    'Easy',
  ],
  [
    '101',
    '1..5.37..6.3..8.9......98...1.......8761..........6...........7.8.9.76.47...6.312',
    '2.2',
    'Medium',
  ],
  [
    '102',
    '..5...74.3..6...19.....1..5...7...2.9....58..7..84......3.9...2.9.4.....8.....1.3',
    '2.6',
    'Medium',
  ],
  [
    '103',
    '38.1.........5.6.....9....3.4.........5.18.......9.561.6..2478.8.......6..4.8..2.',
    '3.7',
    'Medium',
  ],
  [
    '104',
    '.7.16....4....7........8..2..9...2.52..9..1.....5.36..6..2..8..91......3..7.....6',
    '3.3',
    'Medium',
  ],
  [
    '105',
    '9.4.728.....8.36..8..9.....6.9....1..83..7.....7.....22...385.....729..6...6.....',
    '3.3',
    'Medium',
  ],
  [
    '201',
    '...4..56..1.5.6.9.....973....9.2..4.6....5......37....5.2.......63.........96.8..',
    '4.3',
    'Hard',
  ],
  [
    '202',
    '..24..83.....7....5.83..7.98.........23...15.49..2......7.1.......2.5..6..4...2..',
    '4.7',
    'Hard',
  ],
  [
    '203',
    '.4......39..7...4.3.6...2.......9.67....2..54..5.1.9.2..81.2....2..45..9.53......',
    '4.6',
    'Hard',
  ],
  [
    '204',
    '.3...2..1.......6.624..3...3..7..8..2.....3....12.4..7...51....4.......5..9....7.',
    '4.8',
    'Hard',
  ],
  [
    '205',
    '....51.4.5..29..3.....7......7.....823.....6..4978.....2.6...........6.1.7......4',
    '4',
    'Hard',
  ],
  [
    '301',
    '..9..78.3.........8...3.4.91.4......9....1..436..42...6.72...3......395.....7....',
    '6.5',
    'Extra hard',
  ],
  [
    '302',
    '4......9...947...82......5..7.8...1...8.53..7..571.6....2......8..1......6.98....',
    '6',
    'Extra hard',
  ],
  [
    '303',
    '.4......1...7.5...9...3.........15.6.....2..8.79......4.2....3...53..8...9..4...7',
    '6',
    'Extra hard',
  ],
  [
    '304',
    '.8..7...2.......73.....314.8...472...1.6..7...9.5.....2.......59...2.3....1.658..',
    '6.1',
    'Extra hard',
  ],
  [
    '305',
    '..41.927.7......4......8..3..1.3...7.92.........6.5...8..2...6.........2.6...45..',
    '6.2',
    'Extra hard',
  ],
];
var cellsHtmlCollection = [];
var singleCandidatesArray = [];
var singleCandidatesArrayAsStart = [];
var singleCandidateCount = 0;
var incorrectCellCount = 0;
var keysPressed = {};
setUpGame();

function setUpGame() {
  cellsHtmlCollection = document.getElementsByTagName('td');
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const currentCell = cellsHtmlCollection[i * 9 + j];

      currentCell.addEventListener('click', updateCell, false);
      currentCell.id = getIdFromIndex(i + '' + j);
    }
  }
  initializeSingleCandidateArrayFromUserInput();
}

function saveSingleCandidateArrayAsStart() {
  singleCandidatesArrayAsStart = singleCandidatesArray;
}

function updateCell(event) {
  const cell = event.currentTarget;
  const contentBefore = cell.innerText;
  const inputField = document.createElement('input');
  const cellId = cell.id;

  if (cell.classList.contains('given')) {
    return;
  }

  if (incorrectCellCount != 0 && !cell.classList.contains('incorrect')) {
    alert('Resolve the error before continuing the puzzle.');
  }

  if (isSingleCandidate(contentBefore)) {
    updateIncorrectCellsBeforeSubmit(cellId, contentBefore);
  }

  inputField.addEventListener('click', (event) => event.stopPropagation());
  inputField.addEventListener('blur', (event) => submitUserInput(event, cell));
  inputField.addEventListener('keydown', (event) => {
    navigationKeys = [
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Backspace',
      'Shift',
    ];
    isKeyBetweenOneNine = !isNaN(parseInt(event.key)) && event.key != 0;
    isNavigationKey = navigationKeys.includes(event.key);
    if (!isKeyBetweenOneNine && !isNavigationKey) event.preventDefault();
  });

  inputField.addEventListener('keydown', (event) => {
    let clickEvent = new Event('click');
    let currentCell = event.target.parentNode;
    let nextCell;
    let previousCell;

    event.stopPropagation();
    if (event.key == 'Shift') keysPressed[event.key] = true;

    if (event.key != 'Tab') return;

    if (keysPressed['Shift']) {
      ({ currentCell, previousCell } = getPreviousNotGivenCell(
        currentCell,
        previousCell
      ));
    } else {
      ({ nextCell, currentCell } = getNextNotGivenCell(nextCell, currentCell));
    }
    currentCell.dispatchEvent(clickEvent);
  });

  document.addEventListener('keyup', (event) => {
    if (event.key == 'Shift') keysPressed[event.key] = false;
  });

  inputField.type = 'text';
  inputField.value = cell.innerText;

  cell.innerHTML = '';
  cell.appendChild(inputField);
  inputField.focus();

  function getNextNotGivenCell(nextCell, currentCell) {
    do {
      nextCell = currentCell.nextElementSibling;
      if (currentCell.id == '99') nextCell = document.getElementById('11');
      if (!nextCell)
        nextCell = currentCell.parentNode.nextElementSibling.firstElementChild;

      currentCell = nextCell;
    } while (!currentCell || currentCell.classList.contains('given'));
    return { nextCell, currentCell };
  }

  function getPreviousNotGivenCell(currentCell, previousCell) {
    do {
      previousCell = currentCell.previousElementSibling;

      if (currentCell.id == '11') previousCell = document.getElementById('99');
      if (!previousCell)
        previousCell =
          currentCell.parentNode.previousElementSibling.lastElementChild;
      currentCell = previousCell;
    } while (!currentCell || currentCell.classList.contains('given'));
    return { currentCell, previousCell };
  }
}

function submitUserInput(event, cell) {
  const { target: inputField } = event;
  const uniqueInputDigits = getSortedUniqeCandidatesFromInput(inputField.value);

  if (getValueFromSingleCandidates(cell)) {
    singleCandidateCount--;
    updateSingleCandidateCountDisplay();
  }
  updateValueInSingleCandidatesArray(cell, '');
  insertUserInput(cell, uniqueInputDigits);

  inputField.remove();
}

function insertSingleCandidate(cell, singleCandidate) {
  let cellId = cell.id;
  let incorrectCellIndexesForCell = [];

  cell.innerText = singleCandidate;
  updateValueInSingleCandidatesArray(cell, singleCandidate);

  incorrectCellIndexesForCell = getInvalidCellIndexesForCell(
    cellId,
    singleCandidate
  );
  incorrectCellCount = incorrectCellIndexesForCell.length;

  singleCandidateCount++;
  updateSingleCandidateCountDisplay();

  if (incorrectCellCount != 0) {
    toggleIncorrectCellFormating(incorrectCellIndexesForCell);
    return;
  }

  if (singleCandidateCount == 81 && incorrectCellCount == 0) youWon();
}

function insertMultipleCandidates(cell, uniqueInputDigits) {
  const candidateGrid = document.createElement('div');
  candidateGrid.className = 'candidate-grid';
  for (let char of uniqueInputDigits) {
    const candidate = document.createElement('div');
    candidate.innerText = char;
    candidateGrid.appendChild(candidate);
  }
  cell.appendChild(candidateGrid);
}

function getSortedUniqeCandidatesFromInput(candidatesInput) {
  let uniqueCandidates = '';

  if (!candidatesInput) return '';

  for (let char of candidatesInput) {
    if (!uniqueCandidates.includes(char)) {
      uniqueCandidates += char;
    }
  }
  uniqueCandidates = uniqueCandidates.split('').sort().join('');
  return uniqueCandidates;
}

function getInvalidCellIndexesForCell(cellId, singleCandidate) {
  let incorrectCellIndexes = [];
  let rowIndex = getOneIndexFromId(cellId, 0);
  let columnIndex = getOneIndexFromId(cellId, 1);

  incorrectCellIndexes = summarizeInvalidCellIndexesBetweenConstrains(
    rowIndex,
    columnIndex,
    singleCandidate
  );

  incorrectCellIndexes = [...new Set(incorrectCellIndexes)];

  return incorrectCellIndexes;
}

function getIncorrectCellIndexesForBoard(
  singleCandidate,
  incorrectCellIndexesForCell
) {
  let nextCellIdForIteration;
  let incorrectCellIndexesForBoard = [];
  let indirectlyConnectedIncorrectCellIndexes = [];

  if (incorrectCellIndexesForCell.length != 0) {
    nextCellIdForIteration = getIdFromIndex(incorrectCellIndexesForCell[0]);
    indirectlyConnectedIncorrectCellIndexes = getInvalidCellIndexesForCell(
      nextCellIdForIteration,
      singleCandidate
    );
    incorrectCellIndexesForBoard = incorrectCellIndexesForCell.concat(
      indirectlyConnectedIncorrectCellIndexes
    );

    incorrectCellIndexesForBoard = [...new Set(incorrectCellIndexesForBoard)];
  }

  return incorrectCellIndexesForBoard;
}

function getInvalidCellIndexesInRow(rowIndex, columnIndex, singleCandidate) {
  let incorrectCellIndexes = [];
  for (let i = 0; i < singleCandidatesArray[rowIndex].length; i++) {
    const currentSingleCandidate = singleCandidatesArray[rowIndex][i];
    if (singleCandidate == currentSingleCandidate && i != columnIndex) {
      incorrectCellIndexes.push(rowIndex + '' + i);
    }
  }
  return incorrectCellIndexes;
}

function getInvalidCellIndexesInColumn(rowIndex, columnIndex, singleCandidate) {
  let incorrectCellIndexes = [];

  for (let i = 0; i < singleCandidatesArray.length; i++) {
    const currentIncorrectCellIndexes = singleCandidatesArray[i][columnIndex];
    if (singleCandidate == currentIncorrectCellIndexes && i != rowIndex) {
      incorrectCellIndexes.push(i + '' + columnIndex);
    }
  }
  return incorrectCellIndexes;
}

function getInvalidCellIndexesInBox(rowIndex, columnIndex, singleCandidate) {
  let incorrectCellIndexes = [];
  const boxStartRow = Math.floor(rowIndex / 3) * 3;
  const boxStartColumn = Math.floor(columnIndex / 3) * 3;
  const boxEndRow = boxStartRow + 2;
  const boxEndColumn = boxStartColumn + 2;

  for (let i = boxStartRow; i <= boxEndRow; i++) {
    for (let j = boxStartColumn; j <= boxEndColumn; j++) {
      const currentSolution = singleCandidatesArray[i][j];
      if (
        singleCandidate == currentSolution &&
        i != rowIndex &&
        j != columnIndex
      ) {
        incorrectCellIndexes.push(i + '' + j);
      }
    }
  }
  return incorrectCellIndexes;
}

function summarizeInvalidCellIndexesBetweenConstrains(
  rowIndex,
  columnIndex,
  singleCandidate
) {
  let incorrectCellIndexes = getInvalidCellIndexesInRow(
    rowIndex,
    columnIndex,
    singleCandidate
  )
    .concat(
      getInvalidCellIndexesInColumn(rowIndex, columnIndex, singleCandidate)
    )
    .concat(getInvalidCellIndexesInBox(rowIndex, columnIndex, singleCandidate));

  if (incorrectCellIndexes.length != 0) {
    incorrectCellIndexes.push(rowIndex + '' + columnIndex);
  }

  incorrectCellIndexes = [...new Set(incorrectCellIndexes)];

  return incorrectCellIndexes;
}

function getOneIndexFromId(cellId, idPositionIndex) {
  return cellId.substring(idPositionIndex, idPositionIndex + 1) - 1;
}

function getFullIndexFromId(cellId) {
  return getOneIndexFromId(cellId, 0) + '' + getOneIndexFromId(cellId, 1);
}

function getIdFromIndex(cellIndex) {
  let rowId = Number(cellIndex.substring(0, 1)) + 1;
  let columnId = Number(cellIndex.substring(1, 2)) + 1;

  return rowId + '' + columnId;
}

function updateValueInSingleCandidatesArray(cell, value) {
  singleCandidatesArray[getOneIndexFromId(cell.id, 0)][
    getOneIndexFromId(cell.id, 1)
  ] = value;
}

function getValueFromSingleCandidates(cell) {
  return singleCandidatesArray[getOneIndexFromId(cell.id, 0)][
    getOneIndexFromId(cell.id, 1)
  ];
}

function updateSingleCandidateCountDisplay() {
  document.getElementById('solutionCount').innerText =
    'Solutions 81/' + singleCandidateCount;
}

function youWon() {
  document.getElementById('youWon').innerText = 'Wohooo, congrats!';
}

function toggleIncorrectCellFormating(incorrectCellIndexes) {
  incorrectCellIndexes.forEach((currentCellIndex) => {
    const currentCellId = getIdFromIndex(currentCellIndex);
    document.getElementById(currentCellId).classList.toggle('incorrect');
  });
}

function isSingleCandidate(candidateText) {
  return candidateText.length == 1;
}

function resetBoard() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const currentCell = cellsHtmlCollection[i * 9 + j];
      if (!currentCell.classList.contains('given')) currentCell.innerText = '';
      currentCell.classList.remove('incorrect');
    }
  }
  incorrectCellCount = 0;
  singleCandidatesArray = singleCandidatesArrayAsStart;
  updateSingleCandidateCountDisplay();
}

function clearBoard() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const currentCell = cellsHtmlCollection[i * 9 + j];
      currentCell.removeAttribute('class');
      currentCell.innerText = '';
    }
  }
  initializeSingleCandidateArrayFromUserInput();
  singleCandidateCount = 0;
  updateSingleCandidateCountDisplay();
}

function saveBoard() {
  const saveError = getSaveError();

  if (saveError) {
    alert(saveError);
    return false;
  }

  setGivenCells();
  alert('Sudoku successfully saved.');
  return true;
}

function setGivenCells() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const currentCell = cellsHtmlCollection[i * 9 + j];
      const currentCellValue = currentCell.innerText;
      if (currentCellValue) currentCell.className = 'given';
    }
  }
}

function getSaveError() {
  if (singleCandidateCount < 17)
    return 'Enter atleast 17 numbers for a valid sudoku';
  if (getNumberOfSolutions() != 1) return 'Board has multiple solutions';
  return '';
}

function insertUserInput(cell, uniqueInputDigits) {
  if (isSingleCandidate(uniqueInputDigits)) {
    insertSingleCandidate(cell, uniqueInputDigits);
  } else {
    insertMultipleCandidates(cell, uniqueInputDigits);
  }
}

function updateIncorrectCellsBeforeSubmit(cellId, cellValue) {
  let incorrectCellIndexesForCell = getInvalidCellIndexesForCell(
    cellId,
    cellValue
  );
  let incorrectCellIndexesForBoard = getIncorrectCellIndexesForBoard(
    cellValue,
    incorrectCellIndexesForCell
  );

  if (incorrectCellIndexesForCell.length == 0) {
    return;
  }

  if (
    incorrectCellIndexesForCell.length == incorrectCellIndexesForBoard.length
  ) {
    toggleIncorrectCellFormating(incorrectCellIndexesForBoard);
    incorrectCellCount = 0;

    return;
  }

  toggleIncorrectCellFormating([getFullIndexFromId(cellId)]);
  incorrectCellCount--;
}

function getNumberOfSolutions(noOfSolutions = 0) {
  if (noOfSolutions > 1) return noOfSolutions;
  for (let i = 0; i < singleCandidatesArray.length; i++) {
    //go to the next row
    for (let j = 0; j < singleCandidatesArray[i].length; j++) {
      //go to the next column
      if (singleCandidatesArray[i][j] == '') {
        //if it is an empty cell
        for (let n = 1; n < 10; n++) {
          // go from 1-9
          if (
            getInvalidCellIndexesForCell(getIdFromIndex(i + '' + j), n)
              .length == 0
          ) {
            //if it does not violate any constrains
            singleCandidatesArray[i][j] = n; //write in the number
            noOfSolutions = getNumberOfSolutions(noOfSolutions); //solve the next cell
            singleCandidatesArray[i][j] = ''; //tried every option, clear cell
          }
        }
        return noOfSolutions; //increase value from the cell that was modified the last time
      }
    }
  }
  return noOfSolutions + 1;
}

function getRandomSudokuFromDatabase(difficulity) {
  let randomSudokuAsArray = [];
  let randomSudokuPuzzle = [];
  let randomSudokuAsText;
  let puzzlesFilteredByDifficulity = [];
  let randomSudokuIndex;

  puzzlesFilteredByDifficulity = sudokuPuzzles.filter((sudoku) => {
    return sudoku[3] == difficulity;
  });
  randomSudokuIndex = Math.floor(Math.random() * 5);

  randomSudokuPuzzle = puzzlesFilteredByDifficulity[randomSudokuIndex];
  randomSudokuAsText = randomSudokuPuzzle[1];

  randomSudokuAsArray = getSudokuArrayFromText(randomSudokuAsText);

  console.log(randomSudokuAsArray);
  return randomSudokuAsArray;
}

function getSudokuArrayFromText(sudokuAsText) {
  let sudokuAsArray = [];

  for (let i = 0; i < 9; i++) {
    let sudokuLine = [];
    for (let j = 0; j < 9; j++) {
      const digit = sudokuAsText[i * 9 + j];
      if (digit == '.') {
        sudokuLine.push('');
      } else {
        sudokuLine.push(digit);
      }
    }
    sudokuAsArray.push(sudokuLine);
  }
  return sudokuAsArray;
}

function initializeSingleCandidateArrayFromUserInput() {
  singleCandidatesArray = [];
  for (let i = 0; i < 9; i++) {
    const newLine = [];
    for (let j = 0; j < 9; j++) {
      const currentCell = cellsHtmlCollection[i * 9 + j];
      const currentCellContent = currentCell.innerText;

      if (isSingleCandidate(currentCellContent)) {
        newLine.push(currentCellContent);
        singleCandidateCount++;
      } else {
        newLine.push('');
      }
    }
    singleCandidatesArray.push(newLine);
  }
  saveSingleCandidateArrayAsStart();
}

function startNewGame(isImport, sourceValue) {
  let saveError = '';

  clearBoard();

  if (isImport) {
    singleCandidatesArray = getSudokuArrayFromText(sourceValue);
    console.log(singleCandidatesArray);
  } else {
    singleCandidatesArray = getRandomSudokuFromDatabase(sourceValue);
  }
  singleCandidateCount = singleCandidatesArray
    .flat()
    .reduce((accumulator, currentValue) => {
      if (isSingleCandidate(currentValue)) return Number(accumulator + 1);
      return Number(accumulator);
    });

  if (isImport) {
    saveError = getSaveError();
    if (saveError) {
      alert(saveError);
      return false;
    }
  }

  saveSingleCandidateArrayAsStart();

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const currentCell = cellsHtmlCollection[i * 9 + j];
      currentCell.innerText = singleCandidatesArray[i][j];
    }
  }
  setGivenCells();

  console.log(singleCandidateCount);
  updateSingleCandidateCountDisplay();
  return true;
}
