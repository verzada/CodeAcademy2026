namespace Kaffebar.Models
{
    public class Pastry:OrderItem
    {
        public bool IsVegan { get; set; }

        public Pastry(Guid id, string name, decimal price)
        {
            Id = id;
            Name = name;
            Price = price;
        }
    }
}
