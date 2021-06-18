using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Users;
using Application.ViewModels;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IJwtGenerator _jwtGenerator;

        public AccountController(UserManager<AppUser> userManager,
                                    SignInManager<AppUser> signInManager,
                                    IJwtGenerator jwtGenerator)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(Login.Query query)
        {
            return HandleResult(await Mediator.Send(query));
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(Register.Command command)
        {
            if (await _userManager.Users.AnyAsync(u => u.Email.Equals(command.Email)))
            {
                ModelState.AddModelError("email", "Email is already exists.");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(u => u.UserName.Equals(command.Username)))
            {
                ModelState.AddModelError("username", "Username is already exists.");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = command.DisplayName,
                UserName = command.Username,
                Email = command.Username
            };

            var result = await _userManager.CreateAsync(user, command.Password);

            if (result.Succeeded)
            {
                var model = new RegisterModel
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = null
                };
                return HandleResult(Result<RegisterModel>.Success(model));
            }

            throw new Exception("Problem creating user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserModel>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query { User = User });
        }
    }
}