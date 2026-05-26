using IT_Service_Management_System.Data;
using IT_Service_Management_System.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SeedData
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var connectionString = "Server=.;Database=Store;User Id=sa;Password=sa123456;Trusted_Connection=True;TrustServerCertificate=True;";
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            using (var context = new AppDbContext(optionsBuilder.Options))
            {
                var permissionsToAdd = new List<(string Name, string Module, string Display)>
                {
                    ("ViewOrders", "Orders", "View Orders"),
                    ("CreateOrders", "Orders", "Create Orders"),
                    ("EditOrders", "Orders", "Edit Orders"),
                    ("DeleteOrders", "Orders", "Delete Orders"),
                    ("ViewProductCatalogs", "Products", "View Products"),
                    ("CreateProductCatalogs", "Products", "Create Products"),
                    ("EditProductCatalogs", "Products", "Edit Products"),
                    ("DeleteProductCatalogs", "Products", "Delete Products"),
                    ("ViewProductCategories", "Categories", "View Categories"),
                    ("CreateProductCategories", "Categories", "Create Categories"),
                    ("EditProductCategories", "Categories", "Edit Categories"),
                    ("DeleteProductCategories", "Categories", "Delete Categories")
                };

                foreach (var p in permissionsToAdd)
                {
                    if (!await context.Permissions.AnyAsync(x => x.PermissionName == p.Name))
                    {
                        context.Permissions.Add(new Permission
                        {
                            PermissionName = p.Name,
                            DisplayName = p.Display,
                            Description = $"Permission to {p.Display.ToLower()}",
                            IsActive = true,
                            CreatedAt = DateTime.Now
                        });
                        Console.WriteLine($"Added permission: {p.Name}");
                    }
                }

                await context.SaveChangesAsync();
                Console.WriteLine("Seeding completed.");
            }
        }
    }
}
