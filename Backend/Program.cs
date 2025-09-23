using smart_task_manager.Data;
using smart_task_manager.Services;
using smart_task_manager.Models;
using Microsoft.AspNetCore.Identity; // Add this if missing
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens; // Add this if missing
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Register database 
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Setup User Authentication System  
builder.Services.AddIdentity<User, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddDefaultTokenProviders();

// Services
//builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();
//builder.Services.AddHostedService<DeadlineCheckerService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Your React/Vue port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
//Registers authentication services in your ASP.NET app.
builder.Services.AddAuthentication(options =>
{
    //method of how should the app use to check a user’s identity by default    
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;//use JWT tokens in the Authorization header.
                                                                                 //method of how should the app use if someone is not authorized
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; //means “if the token is missing or invalid, return 401 Unauthorized.
})
.AddJwtBearer(options =>
 {//set rules for how to validate JWT tokens
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuerSigningKey = true, //check if the token’s signature was made using the correct secret key.
         IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Secret"])
        ),
         ValidateIssuer = false,
         ValidateAudience = false

     };
 });


builder.Services.AddControllers();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowFrontend");


app.UseHttpsRedirection();

// ADD THIS LINE - CRUCIAL FOR AUTHENTICATION!
app.UseAuthentication(); // ← THIS MUST COME BEFORE UseAuthorization()
app.UseAuthorization();

app.MapControllers();

app.Run();