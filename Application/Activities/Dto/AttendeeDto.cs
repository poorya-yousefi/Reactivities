using System.Collections.Generic;
using Domain;

namespace Application.Activities.Dto
{
    public class AttendeeDto
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public bool Following { get; set; }
        public int FollowingsCount { get; set; }
        public int FollowersCount { get; set; }
        public string Image { get; set; }
    }
}