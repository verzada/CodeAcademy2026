namespace Kaffebar.Models
{
    public class Coffe
    {
        public Guid id { get; set; }
        public required string Name { get; set; }
        public decimal Price { get; set; }
    }
}
