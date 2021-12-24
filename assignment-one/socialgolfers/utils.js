function printWeeks(weekMatrix, numOfGolfers, groupSize) {
  for (const week of weekMatrix) {
    const groups = [];
    for (let i = 0; i < numOfGolfers; i += groupSize)
      groups.push(
        week
          .filter((x, index) => index >= i && index < i + groupSize)
          .map((x) => padNumber(x))
          .join(' ')
          .concat(' | ')
      );
    console.log(groups.join(' '));
  }
}

function padNumber(num) {
  return num < 10 ? `${num} ` : `${num}`;
}

function parseArguments() {
  const n = parseInt(process.argv[2]);
  if (isNaN(n)) {
    console.log('Invalid argument for number of weeks');
    process.exit();
  }

  const interactive = process.argv.includes('--interactive') || process.argv.includes('-i');

  if (!process.argv[1].includes('dfs-bfs.js')) return [n, interactive];

  const algo = process.argv[3];
  if (algo !== 'dfs' && algo !== 'bfs') {
    console.log('Invalid argument for algorithm');
    process.exit();
  }

  return [n, interactive, algo];
}

function getOtherGolfersInGroup(row, column, groupSize, weekMatrix) {
  const group = Math.floor(column / groupSize);
  const groupStart = group * groupSize;
  const groupEnd = groupStart + groupSize - 1;
  return weekMatrix[row].filter((x, index) => index >= groupStart && index <= groupEnd && x !== 0);
}

function delay(seconds) {
  const waitTill = new Date(new Date().getTime() + seconds * 1000);
  while (waitTill > new Date()) {}
}

module.exports = {
  printWeeks,
  parseArguments,
  getOtherGolfersInGroup,
  delay,
};
