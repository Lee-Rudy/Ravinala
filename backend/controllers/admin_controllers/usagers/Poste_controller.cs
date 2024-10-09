using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_poste;
using package_my_db_context;

namespace package_poste_controller
{

    [Route("api/poste")]
    [ApiController]
    public class Poste_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Poste_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<Poste>>> GetPoste()
        {
            return await _context.Poste_instance.ToListAsync();
        }

        //ajout poste
        [HttpPost("ajout")]

        public async Task<ActionResult<Poste>> addPoste(Poste request)
        {
            _context.Poste_instance.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPoste", new{id = request.id}, request);
        }

        //update
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePoste(int id, Poste request)
        {
            var p = await _context.Poste_instance.FindAsync(id);

            if(p == null)
            {
                return NotFound("echec de modification du poste");
            }

            p.poste = request.poste;

            _context.Poste_instance.Update(p);
            await _context.SaveChangesAsync();

            return Ok(p);
        }

        //delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePoste(int id)
        {
            var p = await _context.Poste_instance.FindAsync(id);

            if (p == null)
            {
                return NotFound("l'identifiant du poste est introuvable, echec de la suppression");
            }

            _context.Poste_instance.Remove(p);
            await _context.SaveChangesAsync();

            return Ok($"la supressrion du poste {p.poste} a été supprimé");
        }
       
    }

}