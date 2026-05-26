using Microsoft.AspNetCore.Mvc;

namespace Kaffebar.Controllers
{
    [ApiController]
    [Route("menu")]
    public class MenuController
    {
        public static Coffee[] GetMenu()
        {
            return new[]
            {
                new Coffee(Guid.Parse("329e1156-5da8-4efd-839d-62fe0db97cc4"), "Kaffe Latte", 48.50m),
                new Coffee(Guid.Parse("aca86a68-0644-4628-b62d-2b420900450f"), "Cappuccino", 45.00m),
                new Coffee(Guid.Parse("547f6f9d-869f-4a70-b347-a9afeafee8ae"), "Espresso", 35.00m)
            };
        }
    }
}
