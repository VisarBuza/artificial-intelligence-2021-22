using Google.OrTools.Sat;

var numberOfGroups = int.Parse(args[0]);
var golfersPerGroup = int.Parse(args[1]);
var numberOfWeeks = int.Parse(args[2]);

var numberOfGolfers = numberOfGroups * golfersPerGroup;
var maximumNumberOfWeeks = (numberOfGolfers - 1 )/ (golfersPerGroup - 1);

Console.WriteLine($"Got SGP instance {numberOfGroups}-{golfersPerGroup}-{numberOfWeeks}");
Console.WriteLine($"Maximum number of weeks for the given instance is {maximumNumberOfWeeks}\n");

var model = new CpModel();

var decisionVariablesList = new List<DecisionVariable>();
var decisionVariablesLookup = new Dictionary<string, IntVar>();

for (var golfer = 0; golfer < numberOfGolfers; golfer++)
{
    for (var week = 0; week < numberOfWeeks; week++)
    {   
        for (var group = 0; group < numberOfGroups; group++)
        {
            var key = $"{golfer}_{week}_{group}";
            var plays = model.NewBoolVar(key);
            decisionVariablesLookup[key] = plays;
            decisionVariablesList.Add(new DecisionVariable
            {
                Key = key,
                Week = week,
                Group = group,
                Golfer = golfer,
                CspVariable = plays
            });
        }
    }
}

foreach (var grouped in decisionVariablesList.GroupBy(x => new {Player = x.Golfer, Day = x.Week}))
{
    model.Add(LinearExpr.Sum(grouped.ToList().Select(x => x.CspVariable)) == 1);
}

foreach (var grouped in decisionVariablesList.GroupBy(x => new {Day = x.Week, x.Group}))
{
    model.Add(LinearExpr.Sum(grouped.ToList().Select(x => x.CspVariable)) == golfersPerGroup);   
}

for (var firstGolfer = 0; firstGolfer < numberOfGolfers; firstGolfer++)
{
    for (var secondGolfer = firstGolfer + 1; secondGolfer < numberOfGolfers; secondGolfer++)
    {
        var playersTogether = new List<IntVar>();
        for (var week = 0; week < numberOfWeeks; week++)
        {
            for (var group = 0; group < numberOfGroups; group++)
            {
                var together = model.NewBoolVar($"{firstGolfer}_{secondGolfer}_{week}_{group}");
                playersTogether.Add(together);
                var golfer1 = decisionVariablesLookup[$"{firstGolfer}_{week}_{group}"];
                var golfer2 = decisionVariablesLookup[$"{secondGolfer}_{week}_{group}"];
                model.Add(together == 1).OnlyEnforceIf(new ILiteral[] {golfer1, golfer2});
                model.Add(together == 0).OnlyEnforceIf(new ILiteral[] {golfer1.Not(), golfer2.Not()});
            }
        }
        model.Add(LinearExpr.Sum(playersTogether) == 1);
    }   
}

var solver = new CpSolver();
var status = solver.Solve(model);

var solution =  
    decisionVariablesList.ToDictionary(variable => variable.Key, variable => solver.Value(variable.CspVariable));

PrintSolution();

Console.WriteLine("\nStatistics");
Console.WriteLine($"CspSolverStatus : {status.ToString()}");
Console.WriteLine($"Conflicts : {solver.NumConflicts()}");
Console.WriteLine($"Branches  : {solver.NumBranches()}");
Console.WriteLine($"Wall time : {solver.WallTime()} s");

void PrintSolution()
{
    for (var week = 0; week < numberOfWeeks; week++)
    {
        for (var group = 0; @group < numberOfGroups; @group++)
        {
            for (var golfer = 0; golfer < numberOfGolfers; golfer++)
            {
                if (solution[$"{golfer}_{week}_{group}"] == 1)
                    Console.Write($" {(golfer < 10 ? " " + golfer  : golfer)} ");
            }
            Console.Write(" | ");
        }
        Console.WriteLine("");
    }
}

public readonly record struct  DecisionVariable(string Key, int Golfer, int Week, int Group, IntVar? CspVariable);