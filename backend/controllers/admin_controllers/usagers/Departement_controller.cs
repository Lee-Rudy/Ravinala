using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_departement;
using package_my_db_context;
using package_cars;

namespace package_Departement_controller
{

    [Route("api/departement")]
    [ApiController]
    public class Departement_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Departement_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<Departement>>> GetDepartement()
        {
            return await _context.Departement_instance.ToListAsync();
        }

        //ajout departement
        [HttpPost("ajout")]
        public async Task<ActionResult<Departement>> addDepartement(Departement request)
        {
            _context.Departement_instance.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDepartement", new{id = request.id}, request);
        }

        //update
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateDepartement(int id, Departement request)
        {
            var dept = await _context.Departement_instance.FindAsync(id);

            if(dept == null)
            {
                return NotFound("echec de changement du departement");
            }

            dept.departement = request.departement;

            _context.Departement_instance.Update(dept);
            await _context.SaveChangesAsync();

            return Ok(dept);
        }

        //delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteDepartement(int id)
        {
            var dept = await _context.Departement_instance .FindAsync(id);

            if(dept == null)
            {
                // return NotFound($"echec de la supression{dept.departement}");
                return NotFound("echec de la supression");

            }

            _context.Departement_instance.Remove(dept);
            await _context.SaveChangesAsync();

            return Ok($"la suppression du departement{dept.departement} a été supprimé");
        }
       
    }

}