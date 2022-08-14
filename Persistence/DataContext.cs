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
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        protected override void OnModelCreating(ModelBuilder model)
        {
            //must be add in IdentityDbContext
            base.OnModelCreating(model);

            model.Entity<ActivityAttendee>(x => x.HasKey(aa => new { aa.ActivityId, aa.AppUserId }));

            model.Entity<ActivityAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.Activities)
                .HasForeignKey(aa => aa.AppUserId);

            model.Entity<ActivityAttendee>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            model.Entity<Comment>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Comments)
                .HasForeignKey(c => c.ActivityId);

            model.Entity<Comment>()
                .HasOne(u => u.Author)
                .WithMany(a => a.Comments)
                .HasForeignKey(c => c.AuthorId);

            model.Entity<Comment>()
                .HasOne(u => u.Activity)
                .WithMany(a => a.Comments)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
