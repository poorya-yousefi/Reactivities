using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid AcvtivityId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor, UserManager<AppUser> userManager)
            {
                _context = context;
                _userAccessor = userAccessor;
                _userManager = userManager;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(at => at.AppUser)
                    .SingleOrDefaultAsync(a => a.Id.Equals(request.AcvtivityId));

                if (activity == null) return null;

                var currentUser = await _userManager.FindByNameAsync(_userAccessor.GetUserName());

                if (currentUser == null) return null;

                var hostUserName = activity.Attendees.SingleOrDefault(a => a.IsHost)?.AppUser?.UserName;
                var attendance = activity.Attendees.FirstOrDefault(a => a.AppUser.UserName == currentUser.UserName);

                if (attendance != null && hostUserName == currentUser.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                if (attendance != null && hostUserName != currentUser.UserName)
                    activity.Attendees.Remove(attendance);

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = currentUser,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendance);
                }

                var result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to update attendance");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}