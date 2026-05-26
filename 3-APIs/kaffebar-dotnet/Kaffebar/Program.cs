using Kaffebar.Controllers;
using Kaffebar.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Registrer OpenAPI-tjenestene. Disse genererer spesifikasjonen
// automatisk basert på endepunktene og typene i prosjektet (code-first).
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddValidation();
builder.Services.AddProblemDetails();

// Register in-memory order repository as singleton
builder.Services.AddSingleton<OrderRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Eksponerer den genererte spesifikasjonen på /openapi/v1.json
    app.MapOpenApi();

    // Scalar gir et moderne, interaktivt UI på /scalar/v1
    // for å utforske og teste API-et.
    app.MapScalarApiReference();
}

// --- Hello Coffee --------------------------------------------------------
// Et minimal API-endepunkt som returnerer en hardkodet kaffemeny.
// Dette er utgangspunktet for workshopen. Bygg videre herfra!
app.MapGet("/menu", MenuController.GetMenu)
.WithName("GetMenu")
.WithSummary("Hent kaffemeny")
.WithDescription("Returnerer en liste over alle tilgjengelige kaffedrikker i kaffebaren.");

//app.MapPost("/orders", (Guid coffeId) => 
//{
//    var orderGuid = Guid.NewGuid();
//    var order = new Order(orderGuid, coffeId);
//    return TypedResults.Created($"/orders/{order.id}", order); 
//}
//).WithName("OrderCoffee").WithSummary("Bestill kaffe").WithDescription("Lager en kaffeordre hos kaffebaren");
app.MapControllers();
app.UseStatusCodePages();

app.Run();

// DTO-er kan ligge i Program.cs når prosjektet er lite.
// Etter hvert er det ryddig å flytte dem til egne filer i en Models-mappe.
public record Coffee(Guid Id, string Name, decimal Price);
//public record Order(Guid id, Guid CoffeeId);
