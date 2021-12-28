const { parseArguments, printWeeks, getOtherGolfersInGroup, delay } = require('./utils');

const [weeks] = parseArguments();
const numOfGolfers = 16;
const groupSize = 4;
const weekMatrix = new Array(weeks).fill().map((x) => new Array(numOfGolfers).fill(0));

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

    if (placeGolfer(index + 1)) return true;

    weekMatrix[row][column] = 0;
  }

  return false;
}

function canPlaceGolfer(golfer, row, column) {
  if (weekMatrix[row].includes(golfer)) return false;

  const otherGolfersInGroup = getOtherGolfersInGroup(row, column, groupSize, weekMatrix);

  for (let i = 0; i < row; i++) {
    const previousPosition = weekMatrix[i].indexOf(golfer);
    const previousGolfersInGroup = getOtherGolfersInGroup(
      i,
      previousPosition,
      groupSize,
      weekMatrix
    );

    for (const otherGolfer of otherGolfersInGroup)
      if (previousGolfersInGroup.includes(otherGolfer)) return false;
  }

  return true;
}
