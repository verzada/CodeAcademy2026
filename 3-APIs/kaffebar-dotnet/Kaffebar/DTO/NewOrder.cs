using Kaffebar.Models;
using System.ComponentModel.DataAnnotations;

namespace Kaffebar.DTO
{
    public class NewOrder
    {
        [Required(ErrorMessage = "Kundenavn må være spesifisert i ordren")]
        [StringLength(maximumLength: 100, MinimumLength = 2)]
        public required string CustomerName { get; set; }

        [Required(ErrorMessage = "Kaffe må være spesifisert i ordren")]
        public Guid CoffeId { get; set; }

        [Range(1, 10, ErrorMessage = "Antall må være mellom 1 og 10")]
        public int Quantity { get; set; }
        public OrderSize Size { get; set; }
        public MilkType? MilkType { get; set; }
        public bool? ExtraShot { get; set; }
    }
}
