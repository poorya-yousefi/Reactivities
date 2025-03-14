using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> Details(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }
    }
}