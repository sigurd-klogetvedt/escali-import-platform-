using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using WebAPI.Models;

namespace WebAPI.Data.DbContext;

public class ApplicationDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) {}

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UploadedFile> UploadedFiles => Set<UploadedFile>();
    public DbSet<Interface> Interfaces => Set<Interface>();
    public DbSet<Column> Columns => Set<Column>();
    public DbSet<Status> Statuses => Set<Status>();
    public DbSet<ApprovedColumnValues> ApprovedColumnValues => Set<ApprovedColumnValues>();
    public DbSet<ColumnFieldDescription> ColumnFieldDescriptions => Set<ColumnFieldDescription>();
    public DbSet<InterfaceRule> InterfaceRules => Set<InterfaceRule>();
    public DbSet<RuleCombination> RuleCombinations => Set<RuleCombination>();
    public DbSet<RuleCombinationMember> RuleCombinationMembers => Set<RuleCombinationMember>();
    public DbSet<DataType> DataTypes => Set<DataType>();
    public DbSet<Currency> Currencies => Set<Currency>();
    public DbSet<MappingTemplate> MappingTemplates => Set<MappingTemplate>();
    public DbSet<MappingTemplateColumn> MappingTemplateColumns => Set<MappingTemplateColumn>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasDefaultSchema("turbo_barnacle");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
