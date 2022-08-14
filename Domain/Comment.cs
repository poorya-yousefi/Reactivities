using System;
using Domain;

public class Comment
{
    public Guid Id { get; set; }
    public string Body { get; set; }
    public Guid ActivityId { get; set; }
    public virtual Activity Activity { get; set; }
    public string AuthorId { get; set; }
    public virtual AppUser Author { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}