using System.Text;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
            })
            .AddEntityFrameworkStores<DataContext>()
            .AddSignInManager<SignInManager<AppUser>>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                        .AddJwtBearer(opt =>
                        {
                            opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                            {
                                ValidateIssuerSigningKey = true,
                                //get TokenKey from dotnet user-secrets which is specific in each enviroment or server storage!
                                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["TokenKey"])),
                                ValidateAudience = false,
                                ValidateIssuer = false,
                            };
                            opt.Events = new JwtBearerEvents
                            {
                                OnMessageReceived = context =>
                                {
                                    var accessToken = context.Request.Query["access_token"];
                                    var path = context.HttpContext.Request.Path;
                                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
                                    {
                                        context.Token = accessToken;
                                    }
                                    return Task.CompletedTask;
                                }
                            };
                        });
            services.AddAuthorization(opt =>
            {
                opt.AddPolicy("IsActivityHost", policy =>
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            return services;
        }
    }
}