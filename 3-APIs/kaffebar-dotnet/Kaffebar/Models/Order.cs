using Kaffebar.DTO;
using System.ComponentModel.DataAnnotations;
namespace Kaffebar.Models
{
    public class Order:NewOrder
    {
        [Key]
        public Guid Id { get; set; }

        public OrderStatus Status { get; set; }
    }
}
