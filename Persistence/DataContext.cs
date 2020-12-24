using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }

        protected override void OnModelCreating(ModelBuilder model)
        {
            //must be add in IdentityDbContext
            base.OnModelCreating(model);

            model.Entity<Value>().HasData(
                new Value { Id = 1, Name = "val1" },
                new Value { Id = 2, Name = "val2" },
                new Value { Id = 3, Name = "val3" });
        }
    }
}
