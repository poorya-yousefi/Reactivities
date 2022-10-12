using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Persistence;
using Domain;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                var target = await _context.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);

                if (target == null) return Result<Unit>.Failure("Failed to find target user.");

                var following = await _context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following != null)
                {
                    _context.UserFollowings.Remove(following);
                }
                else
                {
                    var UserFollowing = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _context.UserFollowings.Add(UserFollowing);
                }

                var success = await _context.SaveChangesAsync() > 0;

                if (!success) return Result<Unit>.Failure("Failed to Follow or UnFollow.");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}