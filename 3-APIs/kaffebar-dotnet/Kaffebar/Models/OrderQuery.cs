using System.ComponentModel.DataAnnotations;

namespace Kaffebar.Models
{
    public record OrderQuery
    {
        public OrderStatus? Status { get; set; }

        [Range(20,100)]
        public int Limit = 20;

        public int Offset = 0;
    }
}
