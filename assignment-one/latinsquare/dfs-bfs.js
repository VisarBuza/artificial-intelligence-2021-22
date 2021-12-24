console.log("AI Latin Square using dfs and bfs");
console.log("=============================");
const n = +process.argv[2];
const algo = +process.argv[3];

function search() {
  const latinSquare = new Array(n).fill().map(x => new Array(n).fill(0))
  const squaresToVisit = [latinSquare];
  const visitedSquares = new Map();

  while (true) {
    if (!squaresToVisit.length) {
      console.log('No solution found');
      return;
    }

    const currentTable = algo === 'dfs' ? squaresToVisit.pop() : squaresToVisit.shift();

    if (isSolution(currentTable)) {
      printTable(currentTable);
      return;
    }

    const hash = calculateTableHash(currentTable);
    if (!visitedSquares.has(hash))
      visitedSquares.set(hash, []);
    
    visitedSquares.get(hash).push(currentTable);

    const newTables = generateChildrenTables(currentTable);

    for (const table of newTables) {
      if (!tableExistsInArray(table, squaresToVisit) || !tableExistsInArray(table, visitedSquares))
        squaresToVisit.push(table);
    }
  }
}

function isSolution(table) {
  for (let i = 0; i < n; i++) {
    if (!isRowValid(table, i) || !isColumnValid(table, i))
      return false;
  }

  return true;
}

function isRowValid(table, row) {
  if (Array.from(new Set(table[row])).length !== n || table[row].reduce((acc, curr) => acc + curr, 0) !== (n * (n + 1)) / 2)
    return false;

  return true;
}

function isColumnValid(table, column) {
  const nums = [];
  let sum = 0;

  for (const row of table) {
    nums.push(row[column]);
    sum += row[column];
  }

  if (Array.from(new Set(nums)).length !== n || sum !== (n * (n + 1)) / 2)
    return false;

  return true;
}

function printTable(table) {
  for (const row of table)
    console.log(row.join(' '))
}

function generateChildrenTables(table) {
  let [rowOfEmptyCell, columnOfEmptyCell] = [0, 0];
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (table[i][j] === 0) {
        [rowOfEmptyCell, columnOfEmptyCell] = [i, j];
        return new Array(n).fill().map((x, index) => {
          x = JSON.parse(JSON.stringify(table));
          x[rowOfEmptyCell][columnOfEmptyCell] = index + 1;
          return x;
        })
      }
  
  return [];
}

function tableExistsInArray(table, arrayOfTables) {
  if (arrayOfTables instanceof Map) {
    const hash = calculateTableHash(table);
    if (!arrayOfTables.has(hash))
      return false;
    
    for (const otherTable of arrayOfTables.get(hash))
      if (areTablesEqual(table, otherTable))
        return true;
  
    return false;
  }

  for (const otherTable of arrayOfTables)
    if (areTablesEqual(table, otherTable))
      return true;

  return false;
}

function calculateTableHash(table) {
  let sum = 0;
  table.forEach((x, i) => x.forEach((y, j) => sum += (y * (i + 100)) + j));
  return sum;
}

function areTablesEqual(table1, table2) {
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      if (table1[i][j] !== table2[i][j])
        return false;
  
  return true;
}

search();