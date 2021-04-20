using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ?? (_mediator =
            HttpContext.RequestServices.GetService<IMediator>());

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (!result.IsSuccess && result.Error == "401") return Unauthorized();
            if (!result.IsSuccess && !string.IsNullOrEmpty(result.Error)) return BadRequest(result.Error);
            if (result.IsSuccess && result.Value != null) return Ok(result.Value);
            if (result.Value == null) return NotFound();
            return BadRequest(result.Error);
        }
    }
}