using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_axe;
using package_my_db_context;

namespace package_axe_controller
{

    [Route("api/axe")]
    [ApiController]
    public class Axe_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Axe_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<Axe>>> GetAxe()
        {
            return await _context.Axe_instance.ToListAsync();
        }

        //ajout un axe
        [HttpPost("ajout")]

        public async Task<ActionResult<Axe>> addAxe(Axe request)
        {
            _context.Axe_instance.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetAxe", new{id = request.id}, request);
        }

        //update
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateAxe(int id, Axe request)
        {
            
            var axe = await _context.Axe_instance.FindAsync(id);

            // check if axe existes
            if (axe == null)
            {
                return NotFound("Échec de modification de l'axe.");
            }

            // updatre axe
            axe.axe = request.axe;
            axe.duree_trajet = request.duree_trajet;
            axe.distance_km = request.distance_km;

            
            _context.Axe_instance.Update(axe);

            await _context.SaveChangesAsync();

            // Retourne une réponse de succès
            return Ok($"Modification réussie pour l'axe : {axe.axe}");
        }


        //delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteAxe(int id)
        {
            var axe = await _context.Axe_instance.FindAsync(id);

            if (axe == null)
            {
                return NotFound("l'identifiant de l'axe est introuvable, echec de la suppression");
            }

            _context.Axe_instance.Remove(axe);
            await _context.SaveChangesAsync();

            return Ok($"la supressrion de l'axe {axe.axe} a été supprimé");
        }

        //notifications 
        //check if duree_trajet or distance_km contain a zero in server database
        [HttpGet("notifications")]
        public async Task<ActionResult<IEnumerable<Axe>>> GetIncompleteAxes()
        {
            var incompleteAxes = await _context.Axe_instance
                .Where(a => a.duree_trajet == 0 || a.distance_km == 0)
                .ToListAsync();

            return Ok(incompleteAxes);
        }

        [HttpGet("liste/{id}")]
        public async Task<ActionResult<Axe>> GetAxeById(int id)
        {
            var axe = await _context.Axe_instance.FindAsync(id);

            if (axe == null)
            {
                return NotFound($"Axe avec l'identifiant {id} introuvable.");
            }

            return Ok(axe);
        }

       
    }

}