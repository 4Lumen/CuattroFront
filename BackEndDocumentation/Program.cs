using Microsoft.EntityFrameworkCore;
using CuattroBackAPI.Data;
using Microsoft.OpenApi.Models;
using Minio;
using DotNetEnv;
using CuattroBackAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

// Load environment variables from .env-dev file
DotNetEnv.Env.Load(".env-dev");
DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// Configure environment variables
builder.Configuration.AddEnvironmentVariables();

// Add authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Authority = $"https://{Environment.GetEnvironmentVariable("Auth0__Domain")}";
    options.Audience = Environment.GetEnvironmentVariable("Auth0__Audience");
    options.TokenValidationParameters = new TokenValidationParameters
    {
        NameClaimType = ClaimTypes.NameIdentifier,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

// Add authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdminRole", policy =>
        policy.RequireAssertion(context => 
            context.User.HasClaim(c => 
                c.Type == "email" && c.Value == "gmunaro@gmail.com")));
        
    options.AddPolicy("RequireEmployeeRole", policy =>
        policy.RequireClaim("https://api.cuattro.4lumen.com/roles", "Employee"));
        
    options.AddPolicy("RequireCustomerRole", policy =>
        policy.RequireClaim("https://api.cuattro.4lumen.com/roles", "Customer"));
});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowedOrigins", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:3000",
                "https://localhost:3000",
                "https://cuattro.4lumen.com",
                "https://api.cuattro.4lumen.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithExposedHeaders("Content-Disposition");
    });
});

// Add services to the container.
builder.Services.AddSingleton<IMinioClient>(_ => new MinioClient()
    .WithEndpoint(Environment.GetEnvironmentVariable("MinIO__Endpoint"))
    .WithCredentials(
        Environment.GetEnvironmentVariable("MinIO__AccessKey"),
        Environment.GetEnvironmentVariable("MinIO__SecretKey"))
    .WithSSL()
    .Build());
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();
builder.Services.AddScoped<IStorageService, StorageService>();

// Add DbContext
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

// Configure the HTTP request pipeline.

    app.UseSwagger();
    app.UseSwaggerUI();


// Add CORS middleware before authentication
app.UseCors("AllowedOrigins");

app.UseHttpsRedirection();

// Add authentication middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
