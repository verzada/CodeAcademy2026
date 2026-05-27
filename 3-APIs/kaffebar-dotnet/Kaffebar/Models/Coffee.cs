namespace Kaffebar.Models
{
    public class Coffee:OrderItem
    {
        public MilkType MilkType { get; set; }
        public OrderSize Size { get; set; }

        //Guid.Parse("329e1156-5da8-4efd-839d-62fe0db97cc4"), "Kaffe Latte", 48.50m
        public Coffee(Guid id, string name, decimal price)
        {
            Id = id;
            Name = name;
            Price = price;
        }
    }
}
