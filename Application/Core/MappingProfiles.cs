using System.Linq;
using Application.Activities.Dto;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUserName,
                opt => opt.MapFrom(s => s.Attendees.FirstOrDefault(a => a.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Bio, opt => opt.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Image, opt => opt.MapFrom(s => s.AppUser.Photos.SingleOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.FollowingsCount, opt => opt.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(d => d.Following, opt => opt.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, opt => opt.MapFrom(s => s.Photos.SingleOrDefault(p => p.IsMain).Url))
                .ForMember(d => d.FollowersCount, opt => opt.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.FollowingsCount, opt => opt.MapFrom(s => s.Followings.Count))
                .ForMember(d => d.Following, opt => opt.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.UserName, opt => opt.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, opt => opt.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, opt => opt.MapFrom(s => s.Author.Photos.SingleOrDefault(p => p.IsMain).Url));
        }
    }
}