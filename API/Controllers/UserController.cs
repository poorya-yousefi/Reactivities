using System.Threading.Tasks;
using Application.Users;
using Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<LoginModel>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<RegisterModel>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserModel>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }
    }
}