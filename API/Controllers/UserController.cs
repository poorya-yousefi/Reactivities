using System.Threading.Tasks;
using Application.Users;
using Application.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        [HttpPost("login")]
        public async Task<ActionResult<LoginModel>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }
    }
}