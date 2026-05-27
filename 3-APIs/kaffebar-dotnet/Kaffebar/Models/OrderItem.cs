using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Kaffebar.Models
{
    [JsonDerivedType(typeof(Coffee), "coffee")]
    [JsonDerivedType(typeof(Pastry), "pastry")]
    public class OrderItem
    {
        public Guid Id { get; set; }

        [Range(0, int.MaxValue)]
        public int Quantity { get; set; }

        public string Name { get; set; }
        public decimal Price { get; set; }
   }
}
