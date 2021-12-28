const { printWeeks, parseArguments, getOtherGolfersInGroup, delay } = require('./utils');

const [weeks, interactive, algo] = parseArguments();
const numOfGolfers = 32;
const groupSize = 4;

search();

function search() {
  const firstTable = new Array(weeks).fill().map((x) => new Array(numOfGolfers).fill(0));
  const tablesToVisit = [firstTable];
  const visitedTables = new Map();

  while (true) {
    if (!tablesToVisit.length) {
      console.log('No solution found');
      return;
    }

    const currentTable = algo === 'dfs' ? tablesToVisit.pop() : tablesToVisit.shift();

    if (isSolution(currentTable)) {
      console.clear();
      printWeeks(currentTable, numOfGolfers, groupSize);
      return;
    }

    const hash = calculateTableHash(currentTable);
    if (!visitedTables.has(hash)) visitedTables.set(hash, []);

    visitedTables.get(hash).push(currentTable);

    const newTables = generateChildrenTables(currentTable);

    for (const table of newTables) {
      if (!tableExistsInArray(table, tablesToVisit) || !tableExistsInArray(table, visitedTables))
        tablesToVisit.push(table);
    }
  }
}

function isSolution(table) {
  const games = new Map();
  for (let i = 0; i < numOfGolfers; i++) {
    for (let j = 0; j < weeks; j++) {
      const value = table[j][i];
      if (value === 0) return false;

      if (!games.has(value)) games.set(value, new Set());

      const otherGolfersInGroup = getOtherGolfersInGroup(j, i, groupSize, table).filter(
        (x) => x === value
      );
      const alreadyPlayed = games.get(value);

      for (const golfer in otherGolfersInGroup) {
        if (alreadyPlayed.has(golfer)) return false;
        alreadyPlayed.add(golfer);
      }
    }
  }

  return true;
}

function generateChildrenTables(table) {
  let [rowOfEmptyCell, columnOfEmptyCell] = [0, 0];
  for (let i = 0; i < numOfGolfers; i++)
    for (let j = 0; j < weeks; j++)
      if (table[j][i] === 0) {
        [rowOfEmptyCell, columnOfEmptyCell] = [j, i];
        return new Array(numOfGolfers).fill().map((x, index) => {
          x = JSON.parse(JSON.stringify(table));
          x[rowOfEmptyCell][columnOfEmptyCell] = index + 1;
          return x;
        });
      }

  return [];
}

function tableExistsInArray(table, arrayOfTables) {
  if (arrayOfTables instanceof Map) {
    const hash = calculateTableHash(table);
    if (!arrayOfTables.has(hash)) return false;

    for (const otherTable of arrayOfTables.get(hash))
      if (areTablesEqual(table, otherTable)) return true;

    return false;
  }

  for (const otherTable of arrayOfTables) if (areTablesEqual(table, otherTable)) return true;

  return false;
}

function calculateTableHash(table) {
  let sum = 0;
  table.forEach((x, i) => x.forEach((y, j) => (sum += y * (i + 100) + j)));
  return sum;
}

function areTablesEqual(table1, table2) {
  for (let i = 0; i < numOfGolfers; i++)
    for (let j = 0; j < weeks; j++) if (table1[j][i] !== table2[j][i]) return false;

  return true;
}
