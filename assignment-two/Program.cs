// See https://aka.ms/new-console-template for more information

using Google.OrTools.Sat;

var numberOfPlayers = 32;
var numberOfDays = 9;
var playersPerGroup = 4;
var numberOfGroups = numberOfPlayers / playersPerGroup;
    
var model = new CpModel();

var schedule = new Dictionary<string, IntVar>();
var playerAssignments = new List<PlayerAssignment>();

for (var p = 0; p < numberOfPlayers; p++)
{
    for (var d = 0; d < numberOfDays; d++)
    {
        for (var g = 0; g < numberOfGroups; g++)
        {
            var key = $"{p}_{d}_{g}";
            var plays = model.NewBoolVar(key);
            schedule[key] = plays;
            playerAssignments.Add(new PlayerAssignment
            {
                Key = key,
                Day = d,
                Group = g,
                Player = p,
                CspVariable = plays
            });
        }
    }
}

foreach (var grouped in playerAssignments.GroupBy(x => new { x.Player, x.Day}))
{
    model.Add(LinearExpr.Sum(grouped.ToList().Select(x => x.CspVariable)) == 1);
}

foreach (var grouped in playerAssignments.GroupBy(x => new { x.Day, x.Group}))
{
    model.Add(LinearExpr.Sum(grouped.ToList().Select(x => x.CspVariable)) == playersPerGroup);   
}

for (var p1 = 0; p1 < numberOfPlayers; p1++)
{
    for (var p2 = p1 + 1; p2 < numberOfPlayers; p2++)
    {
        var playersTogether = new List<IntVar>();
        for (var d = 0; d < numberOfDays; d++)
        {
            for (var g = 0; g < numberOfGroups; g++)
            {
                var together = model.NewBoolVar($"{p1}_{p2}_{d}_{g}");
                playersTogether.Add(together);
                var player1 = schedule[$"{p1}_{d}_{g}"];
                var player2 = schedule[$"{p2}_{d}_{g}"];
                model.Add(together == 1).OnlyEnforceIf(new ILiteral[] {player1, player2});
                model.Add(together == 0).OnlyEnforceIf(new ILiteral[] {player1.Not(), player2.Not()});
                // model.Add(player1 + player2 - together <= 1);
            }
        }

        model.Add(LinearExpr.Sum(playersTogether) == 1);
    }   
}


var solver = new CpSolver();
solver.Solve(model);

Console.WriteLine("Statistics");
Console.WriteLine($"  conflicts : {solver.NumConflicts()}");
Console.WriteLine($"  branches  : {solver.NumBranches()}");
Console.WriteLine($"  wall time : {solver.WallTime()} s");

var solution = new Dictionary<string, long>();
foreach (var assignment in playerAssignments)
{
    solution[$"{assignment.Player}_{assignment.Day}_{assignment.Group}"] = solver.Value(assignment.CspVariable);
}

for (var day = 0; day < numberOfDays; day++)
{
    Console.WriteLine($"Day: {day}");
    for (var group = 0; group < numberOfGroups; group++)
    {
        for (var player = 0; player < numberOfPlayers; player++)
        {
            if (solution[$"{player}_{day}_{group}"] == 1)
            {
                Console.Write($"{player}, ");
            }
        }

        Console.WriteLine();
    }
}  


public readonly record struct PlayerAssignment(string Key, int Player, int Day, int Group, IntVar? CspVariable);