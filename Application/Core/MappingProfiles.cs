using System.Linq;
using Application.Activities.Dto;
using Application.Users.Dto;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName,
                opt => opt.MapFrom(s => s.Attendees.FirstOrDefault(a => a.IsHost).AppUser.UserName));
            CreateMap<ActivityAttendee, ProfileDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Bio, opt => opt.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.AppUser.UserName));

        }
    }
}