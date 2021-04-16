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
        public async Task<IActionResult> Login(Login.Query query)
        {
            return HandleResult(await Mediator.Send(query));
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(Register.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserModel>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.Query());
        }
    }
}