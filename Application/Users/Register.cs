using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Application.ViewModels;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
    public class Register
    {
        public class Command : IRequest<RegisterModel>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, RegisterModel>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(DataContext context,
                            UserManager<AppUser> userManager,
                            IJwtGenerator jwtGenerator)
            {
                _context = context;
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
            }
            public async Task<RegisterModel> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _userManager.Users.AnyAsync(u => u.Email.Equals(request.Email)))
                    throw new RestException(HttpStatusCode.BadRequest, new
                    {
                        Email = "Email is already exists."
                    });

                if (await _userManager.Users.AnyAsync(u => u.UserName.Equals(request.Username)))
                    throw new RestException(HttpStatusCode.BadRequest, new
                    {
                        Username = "Username is already exists."
                    });

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    UserName = request.Username,
                    Email = request.Username
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (result.Succeeded)
                    return new RegisterModel
                    {
                        DisplayName = user.DisplayName,
                        Username = user.UserName,
                        Token = _jwtGenerator.CreateToken(user),
                        Image = null
                    };

                throw new Exception("Problem creating user");
            }

        }
    }
}