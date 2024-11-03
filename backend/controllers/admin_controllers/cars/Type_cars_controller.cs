using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_my_db_context;
using package_type_cars;

namespace package_type_cars_controller
{
    [Route("api/type_cars")]
    [ApiController]
    public class Type_cars_controller : ControllerBase
    {
         private readonly MyDbContext _context;

        public Type_cars_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<Type_cars>>> GetType_cars()
        {
            return await _context.Type_cars_instance.ToListAsync();
        }
    }
}
