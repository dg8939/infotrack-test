using API;

// Part of ASP.NET Core which helps to create a web application from console app
var builder = WebApplication.CreateBuilder(args);

// Swagger services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// datapoints
app.MapGet("/health", () => Results.Ok("OK"));

app.MapPost("/api/property/normalize", (ExternalProperty p) =>
{
    InternalProperty result = NormalizeProperty.PropertyMapping(p);
    return Results.Ok(result);
});

app.Run();