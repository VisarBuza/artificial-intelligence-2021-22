const { parseArguments, printWeeks, getOtherGolfersInGroup, delay } = require('./utils');

const [weeks, interactive] = parseArguments();
const numOfGolfers = 32;
const groupSize = 4;
const weekMatrix = new Array(weeks).fill().map((x) => new Array(numOfGolfers).fill(0));
const golferDomains = new Array(numOfGolfers).fill().map((x) => new Array(numOfGolfers).fill(1));

if (placeGolfer()) {
  console.clear();
  printWeeks(weekMatrix, numOfGolfers, groupSize);
}

function placeGolfer(index = 0) {
  if (index === weeks * numOfGolfers) return true;

  const [row, column] = [Math.floor(index / numOfGolfers), index % numOfGolfers];

  for (let i = 1; i <= numOfGolfers; i++) {
    if (!canPlaceGolfer(i, row, column)) continue;

    weekMatrix[row][column] = i;
    updateDomain(0, i, row, column);

    if (interactive) {
      delay(0.3);
      console.clear();
      printWeeks(weekMatrix, numOfGolfers, groupSize);
    }

    if (placeGolfer(index + 1)) return true;

    updateDomain(1, i, row, column);
    weekMatrix[row][column] = 0;
  }

  return false;
}

function canPlaceGolfer(golfer, row, column) {
  if (weekMatrix[row].includes(golfer)) return false;

  const otherGolfersInGroup = getOtherGolfersInGroup(row, column, groupSize, weekMatrix);

  for (const otherGolfer of otherGolfersInGroup)
    if (
      golferDomains[otherGolfer - 1][golfer] === 0 ||
      golferDomains[golfer - 1][otherGolfer] === 0
    )
      return false;

  return true;
}

function updateDomain(value, golfer, row, column) {
  const otherGolfersInGroup = getOtherGolfersInGroup(row, column, groupSize, weekMatrix);
  setDomain(value, golfer, otherGolfersInGroup);
}

function setDomain(domainValue, golfer, otherGolfers) {
  for (const otherGolfer of otherGolfers) {
    golferDomains[otherGolfer - 1][golfer] = domainValue;
    golferDomains[golfer - 1][otherGolfer] = domainValue;
  }
}
