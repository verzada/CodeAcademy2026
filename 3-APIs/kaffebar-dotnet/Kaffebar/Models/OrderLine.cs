namespace Kaffebar.Models
{
    public class OrderLine
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; }
        public OrderItem OrderItem { get; set; }



        //[Required(ErrorMessage = "Kaffe må være spesifisert i ordren")]
        //public Guid CoffeId { get; set; }

        //[Range(1, 10, ErrorMessage = "Antall må være mellom 1 og 10")]
        //public int Quantity { get; set; }
        //public OrderSize Size { get; set; }
        //public MilkType? MilkType { get; set; }
        //public bool? ExtraShot { get; set; }

    }
}
