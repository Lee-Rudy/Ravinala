using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_conducteurs;
using package_my_db_context;

namespace package_conducteurs_controller
{

    [Route("api/conducteurs")]
    [ApiController]
    public class Conducteurs_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Conducteurs_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<Conducteurs>>> GetConducteurs()
        {
            return await _context.Conducteurs_instance.ToListAsync();
        }

        //add conducteur
        [HttpPost("ajout")]

        public async Task<ActionResult<Conducteurs>> addConducteurs(Conducteurs request)
        {
            if (request.date_naissance.HasValue)
            {
                // Convertir la date à UTC avant de l'enregistrer
                request.date_naissance = request.date_naissance.Value.ToUniversalTime();
            }

            _context.Conducteurs_instance.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetConducteurs", new { id = request.id }, request);
        }


        //update
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateConducteurs(int id, Conducteurs request)
        {
            var conducteur = await _context.Conducteurs_instance.FindAsync(id);
            
            if (conducteur == null)
            {
                return NotFound("Le conducteur avec l'ID spécifié n'existe pas.");
            }

            conducteur.nom = request.nom;
            conducteur.contact = request.contact;
            conducteur.mail = request.mail;
            conducteur.adresse = request.adresse;
            
            if (request.date_naissance.HasValue)
            {
                // Convert date
                conducteur.date_naissance = request.date_naissance.Value.ToUniversalTime();
            }

            // save update
            _context.Conducteurs_instance.Update(conducteur);
            await _context.SaveChangesAsync();

            return Ok(conducteur);
        }

        //delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteConducteurs(int id)
        {
            var conducteur = await _context.Conducteurs_instance.FindAsync(id);
            
            if (conducteur == null)
            {
                return NotFound("Le conducteur avec l'ID spécifié n'existe pas.");
            }

            _context.Conducteurs_instance.Remove(conducteur);
            await _context.SaveChangesAsync();

            return Ok($"Le conducteur avec l'ID {id} a été supprimé.");
        }

    }

}