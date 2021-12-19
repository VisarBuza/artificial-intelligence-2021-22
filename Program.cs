Console.WriteLine("AI Latin Square FC and BC");
Console.WriteLine("=============================");
Console.Write("N = ");
var n = int.Parse(Console.ReadLine() ?? string.Empty);
Console.Write("Alg FC | BT = ");
var alg = Console.ReadLine() ?? string.Empty;

if (n == 0) return;

var latinSquare = new int[n, n];
var possibleValues = new HashSet<int>[n, n];
for (var i = 0; i < n; i++)
{
    for (var j = 0; j < n; j++)
    {
        possibleValues[i, j] = new HashSet<int>(Enumerable.Range(1, n));
    }
}

if (alg.ToUpper() == "FC")
    ForwardCheck(0);
else
    Backtrack(0);

for (var i = 0; i < n; i++)
{
    for (var j = 0; j < n; j++)
    {
        Console.Write($"\t{latinSquare[i, j]}");
    }
    Console.WriteLine();
}

bool ForwardCheck(int number)
{
    if (number == n * n) return true;
    
    var row = number / n;
    var column = number % n;

    for (var i = 1; i <= n; i++)
    {
        if (!possibleValues[row, column].Contains(i)) continue;

        latinSquare[row, column] = i;

        var removed = new List<(int, int)>();

        for (var j = 0; j < n; j++)
        {
            if (possibleValues[row, j].Contains(i))
            {
                possibleValues[row, j].Remove(i);
                removed.Add((row, j));
            }
            
            if (possibleValues[j, column].Contains(i))
            {
                possibleValues[j, column].Remove(i);
                removed.Add((j, column));
            }
        }
        
        if(ForwardCheck(number + 1)) return true;
        
        foreach (var (currRow, currCol) in removed)
        {
            possibleValues[currRow, currCol].Add(i);
        }

        latinSquare[row, column] = 0;
    }

    return false;
}

bool Backtrack(int number)
{
    if (number == n * n) return true;
    
    var row = number / n;
    var column = number % n;

    for (var i = 1; i <= n; i++)
    {
        if (!isValidNumber(row, column, i)) continue;

        latinSquare[row, column] = i;

        if(Backtrack(number + 1)) return true;

        latinSquare[row, column] = 0;
    }

    return false;
}

bool isValidNumber(int row, int column, int number)
{
    for (var i = 0; i < n; i++)
        if (latinSquare[row, i] == number || latinSquare[i, column] == number) return false;

    return true;
}

