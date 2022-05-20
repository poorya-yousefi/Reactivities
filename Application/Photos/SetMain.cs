using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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
                var user = await _context.Users.Include(u => u.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUserName());

                if (user == null) return null;

                var mainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);

                if (mainPhoto != null) mainPhoto.IsMain = false;

                var photo = user.Photos.FirstOrDefault(p => p.Id.Equals(request.Id));

                if (photo == null) return null;

                photo.IsMain = true;

                var result = await _context.SaveChangesAsync() > 0;

                if (!result) return Result<Unit>.Failure("Failed to set photo as main photo.");

                return Result<Unit>.Success(Unit.Value);

            }
        }

    }
}