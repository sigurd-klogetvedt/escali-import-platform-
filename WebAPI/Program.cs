using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using WebAPI.Data.DbContext;
using WebAPI.Middleware;
using WebAPI.Services.Interfaces;
using WebAPI.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

// Claims transformation (validates user against DB after Entra login)
builder.Services.AddScoped<IUserValidationService, UserValidationService>();
builder.Services.AddScoped<IClaimsTransformation, EntraClaimsTransformation>();
builder.Services.AddScoped<IInterfaceService, InterfaceService>();
builder.Services.AddScoped<IStatusService, StatusService>();
builder.Services.AddScoped<ICurrencyService, CurrencyService>();
builder.Services.AddScoped<IApprovedColumnValuesService, ApprovedColumnValuesService>();
builder.Services.AddScoped<IInterfaceRuleService, InterfaceRuleService>();
builder.Services.AddScoped<IDataTypeService, DataTypeService>();
builder.Services.AddScoped<IMappingTemplateService, MappingTemplateService>();

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ValidUser", policy =>
        policy.RequireClaim("db_validated", "true"));

    options.AddPolicy("Admin", policy =>
        policy.RequireAssertion(ctx =>
            ctx.User.HasClaim("db_is_admin", "true") ||
            ctx.User.HasClaim("db_permission", "Admin")));

    options.AddPolicy("ReadWrite", policy =>
        policy.RequireAssertion(ctx =>
            ctx.User.HasClaim("db_is_admin", "true") ||
            ctx.User.HasClaim("db_permission", "Admin") ||
            ctx.User.HasClaim("db_permission", "User")));
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5248", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .WithExposedHeaders("Content-Disposition");
    });
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Entity Framework 
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions => sqlOptions.MigrationsHistoryTable("__EFMigrationsHistory", "turbo_barnacle")
));

// Singelton instead of Scoped since we only need once blobclient instrance per app
builder.Services.AddSingleton<BlobStorageService>();
builder.Services.AddScoped<IUploadedFileService, UploadFileService>();

builder.Services.AddSingleton<LocalFileStorageService>();
builder.Services.AddScoped<ILocalUploadedFileService, LocalUploadedFileService>();

builder.Services.AddSingleton<IFileStorageService>(sp => sp.GetRequiredService<BlobStorageService>());
System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
builder.Services.AddScoped<IFilePreviewService, FilePreviewService>();

var app = builder.Build();

// Test database connection
try
{
    using (var scope = app.Services.CreateScope())
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

        var canConnect = await dbContext.Database.CanConnectAsync();

        if (canConnect)
        {
            logger.LogInformation("Successfully connected to the database.");
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            var databaseName = connectionString?.Split(';')
                .FirstOrDefault(s => s.TrimStart().StartsWith("Database=", StringComparison.OrdinalIgnoreCase))?
                .Split('=')[1]?.Trim() ?? "Unknown";
            logger.LogInformation("Database: {DatabaseName}", databaseName);
        }
        else
        {
            logger.LogWarning("Database connection test returned false.");
        }
    }
} catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Failed to connect to the database");
    throw;
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
