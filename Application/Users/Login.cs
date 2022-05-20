using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Errors;
using Application.Interfaces;
using Application.ViewModels;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users
{
    public class Login
    {
        public class Query : IRequest<Result<LoginModel>>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, Result<LoginModel>>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly SignInManager<AppUser> signInManager;
            private readonly IJwtGenerator jwtGenerator;

            public Handler(UserManager<AppUser> userManager,
                            SignInManager<AppUser> signInManager,
                            IJwtGenerator jwtGenerator)
            {
                this.userManager = userManager;
                this.signInManager = signInManager;
                this.jwtGenerator = jwtGenerator;
            }

            public async Task<Result<LoginModel>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await userManager.Users.Include(u => u.Photos)
                            .FirstOrDefaultAsync(u => u.Email.Equals(request.Email));

                if (user == null) return Result<LoginModel>.Unauthorized();

                var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    var model = new LoginModel
                    {
                        DisplayName = user.DisplayName,
                        Username = user.UserName,
                        Token = jwtGenerator.CreateToken(user),
                        Image = user.Photos?.FirstOrDefault(p => p.IsMain)?.Url
                    };

                    return Result<LoginModel>.Success(model);
                }
                else
                {
                    return Result<LoginModel>.Failure("Password is wrong.");
                }
            }
        }
    }
}