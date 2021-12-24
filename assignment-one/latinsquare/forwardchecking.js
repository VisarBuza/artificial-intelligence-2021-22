console.log("AI Latin Square using forward checking FC");
console.log("=============================");
const n = +process.argv[2];

if (n == 0) return;

const latinSquare = new Array(n).fill().map(x => new Array(n).fill(0));
const possibleValues = new Array(n).fill().map(x => new Array(n).fill().map(y => new Array(n).fill(0).map((x, i) => i + 1)));

forwardCheck(0);

for (let row of latinSquare) 
    console.log(row.join(' '))

function forwardCheck(number)
{
    if (number == n * n) return true;
    
    var row = Math.floor(number / n);
    var column = number % n;

    for (var i = 1; i <= n; i++)
    {
        if (!possibleValues[row][column].includes(i)) continue;

        latinSquare[row][column] = i;

        let removed = [];

        for (var j = 0; j < n; j++)
        {
            if (possibleValues[row][j].includes(i))
            {
                possibleValues[row][j].splice(possibleValues[row][j].indexOf(i), 1);
                removed.push([row, j]);
            }
            
            if (possibleValues[j][column].includes(i))
            {
                possibleValues[j][column].splice(possibleValues[j][column].indexOf(i), 1);
                removed.push([j, column]);
            }
        }
        
        if(forwardCheck(number + 1)) return true;
        
        for (var [currRow, currCol] of removed)
        {
            possibleValues[currRow][currCol].push(i);
        }

        latinSquare[row][column] = 0;
    }

    return false;
}