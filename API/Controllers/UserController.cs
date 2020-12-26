using System.Threading.Tasks;
using Application.Users;
using Application.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class UserController : BaseController
    {
        [HttpPost("login")]
        public async Task<ActionResult<LoginModel>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        public async Task<ActionResult<RegisterModel>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}