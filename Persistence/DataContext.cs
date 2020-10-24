using System;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Value> Values { get; set; }

        protected override void OnModelCreating(ModelBuilder model)
        {
            model.Entity<Value>().HasData(
                new Value { Id = 1, Name = "val1" },
                new Value { Id = 2, Name = "val2" },
                new Value { Id = 3, Name = "val3" });
        }
    }
}
