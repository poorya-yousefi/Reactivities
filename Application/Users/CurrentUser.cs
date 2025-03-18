using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.ViewModels;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users
{
    public class CurrentUser
    {
        public class Query : IRequest<Result<UserModel>>
        {
            public ClaimsPrincipal User { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<UserModel>>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(UserManager<Domain.AppUser> userManager,
                            IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<Result<UserModel>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.Users.Include(u => u.Photos)
                            .FirstOrDefaultAsync(u => u.Email.Equals(request.User.FindFirstValue(ClaimTypes.Email)));

                if (user == null) return Result<UserModel>.Unauthorized();

                var model = new UserModel
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = user.Photos?.FirstOrDefault(p => p.IsMain)?.Url
                };

                return Result<UserModel>.Success(model);
            }
        }
    }
}