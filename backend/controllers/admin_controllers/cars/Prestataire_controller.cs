using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_my_db_context;
using package_prestataire;

namespace package_prestataire_controller
{
    [Route("api/prestataire")]
    [ApiController]
    public class Prestataire_controller : ControllerBase
    {
         private readonly MyDbContext _context;

        public Prestataire_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<Prestataire>>> GetPrestataire()
        {
            return await _context.Prestataire_instance.ToListAsync();
        }

        // Get a single prestataire by ID
        [HttpGet("liste/{id}")]
        public async Task<ActionResult<Prestataire>> GetPrestataireById(int id)
        {
            var prestataire = await _context.Prestataire_instance.FindAsync(id);

            if (prestataire == null)
            {
                return NotFound();
            }

            return prestataire;
        }

        // Create a new prestataire
        [HttpPost("ajouter")]
        public async Task<ActionResult<Prestataire>> CreatePrestataire(Prestataire prestataire)
        {
            _context.Prestataire_instance.Add(prestataire);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPrestataireById), new { id = prestataire.id }, prestataire);
        }

        // Update prestataire
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdatePrestataire(int id, [FromBody] Prestataire prestataire)
        {
            if (id != prestataire.id)
            {
                return BadRequest("L'ID du prestataire ne correspond pas.");
            }

            _context.Entry(prestataire).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Prestataire_instance.Any(e => e.id == id))
                {
                    return NotFound("Prestataire non trouvé.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        // Delete a prestataire , don't use
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeletePrestataire(int id)
        {
            var prestataire = await _context.Prestataire_instance.FindAsync(id);
            if (prestataire == null)
            {
                return NotFound();
            }

            _context.Prestataire_instance.Remove(prestataire);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PrestataireExists(int id)
        {
            return _context.Prestataire_instance.Any(e => e.id == id);
        }
    }
}
