using System.Linq;
using Application.Activities.Dto;
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

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Bio, opt => opt.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Image, opt => opt.MapFrom(s => s.AppUser.Photos.SingleOrDefault(p => p.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, opt => opt.MapFrom(s => s.Photos.SingleOrDefault(p => p.IsMain).Url));
        }
    }
}