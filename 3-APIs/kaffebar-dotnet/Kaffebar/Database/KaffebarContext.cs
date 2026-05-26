using Kaffebar.Models;
using Microsoft.EntityFrameworkCore;

namespace Kaffebar.Database
{
    public class KaffebarContext:DbContext
    {
        public DbSet<Coffee> Coffees { get; set; }
        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Order>()
                .Property(o => o.Size)
                .HasConversion<string>();
        }
    }
}
