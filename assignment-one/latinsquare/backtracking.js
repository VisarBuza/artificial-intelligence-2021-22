console.log("AI Latin Square using backtracking");
console.log("=============================");
const n = +process.argv[2];

if (n == 0) return;

const latinSquare = new Array(n).fill().map(x => new Array(n).fill(0));

backtrack(0);

for (let row of latinSquare) 
    console.log(row.join(' '))

function backtrack(number)
{
    if (number == n * n) return true;
    
    var row = Math.floor(number / n);
    var column = number % n;

    for (var i = 1; i <= n; i++)
    {
        if (!isValidNumber(row, column, i)) continue;

        latinSquare[row][column] = i;

        if(backtrack(number + 1)) return true;

        latinSquare[row][column] = 0;
    }

    return false;
}

function isValidNumber(row, column, number)
{
    for (var i = 0; i < n; i++)
        if (latinSquare[row][i] == number || latinSquare[i][column] == number) return false;

    return true;
}