using System;
using System.Collections.Generic;

namespace Application.Activities.Dto
{
    public class ActivityDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public DateTime Date { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }
        public string HostUserName { get; set; }
        public bool IsCancelled { get; set; }
        public ICollection<AttendeeDto> Attendees { get; set; }
    }
}