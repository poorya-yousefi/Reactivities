using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _accessor;

        public UserAccessor(IHttpContextAccessor accessor)
        {
            _accessor = accessor;
        }

        public string GetUserName()
        {
            return _accessor.HttpContext.User.FindFirstValue(ClaimTypes.Name);//give username
            //return _accessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);//give user-id (note-sure!)
        }
    }
}