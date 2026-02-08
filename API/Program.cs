using API;
using System;
using System.IO;
using System.Text.Json;

class Program
{
    static void Main()
    {
        var json = File.ReadAllText("ExternalProperty.json");

        // Converting JSON into C# object
        var input = JsonSerializer.Deserialize<ExternalProperty>(json);

        // Safety check
        if (input == null)
        {
            Console.WriteLine("Invalid JSON");
            return;
        }

        // Calling the function
        var output = NormalizeProperty.PropertyMapping(input);

        // Changing C# object into JSON
        var outputJson = JsonSerializer.Serialize(
            output,
            new JsonSerializerOptions { WriteIndented = true } // Makes the output look nicer
        );

        Console.WriteLine(outputJson);
    }
}
