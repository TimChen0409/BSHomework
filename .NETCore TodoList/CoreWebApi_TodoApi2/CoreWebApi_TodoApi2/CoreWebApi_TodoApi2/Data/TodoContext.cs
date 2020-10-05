using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CoreWebApi_TodoApi2.Models;

namespace CoreWebApi_TodoApi2.Data
{
    public class TodoContext : DbContext
    {
        public TodoContext(DbContextOptions<TodoContext> options) : base(options)//Options Pattern選項模式
        {
        }
        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
