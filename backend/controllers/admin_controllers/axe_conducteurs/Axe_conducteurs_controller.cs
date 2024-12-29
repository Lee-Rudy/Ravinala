using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_axe_conducteurs;
using package_axe;
using package_conducteurs;
using package_cars;
using package_axe_conducteurs_request;
using package_my_db_context;


namespace package_axe_conducteurs_controller
{
    [Route("api/axe_conducteurs")]
    [ApiController]
    public class Axe_conducteurs_controller : ControllerBase
    {

        private readonly MyDbContext _context;

            public Axe_conducteurs_controller(MyDbContext context)
            {
                _context = context;
            }

            //get list cars
            [HttpGet("liste")]
            public async Task<ActionResult<IEnumerable<Axe_conducteurs>>> GetAxe_conducteurs()
            {
                return await _context.Axe_conducteurs_instance.ToListAsync();
            }


            [HttpPost("ajouter")]
            public async Task<ActionResult<Axe_conducteurs>> PostAxe_conducteurs(Axe_conducteurs axeConducteurs)
            {
                if (axeConducteurs == null)
                {
                    return BadRequest("Les données de l'axe conducteur sont manquantes.");
                }

                _context.Axe_conducteurs_instance.Add(axeConducteurs);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAxe_conducteurs), new { id = axeConducteurs.id }, axeConducteurs);
            }

            [HttpPut("update/{id}")]
            public async Task<IActionResult> UpdateAxeConducteurs(int id, Axe_conducteurs axeConducteurs)
            {
                if (id != axeConducteurs.id)
                {
                    return BadRequest("L'ID de l'assignation ne correspond pas.");
                }

                _context.Entry(axeConducteurs).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!_context.Axe_conducteurs_instance.Any(e => e.id == id))
                    {
                        return NotFound("Assignation non trouvée.");
                    }
                    else
                    {
                        throw;
                    }
                }

                return NoContent();
            }

            [HttpGet("details")]
            public async Task<ActionResult<IEnumerable<object>>> GetAxeConducteursCarsDetails()
            {
                var result = await _context.Axe_conducteurs_instance
                    .Include(ac => ac.Axe) 
                    .Include(ac => ac.Conducteurs)
                    .Include(ac => ac.Cars)
                    .Select(ac => new 
                    {
                        axe_id = ac.Axe.id,
                        nom_axe = ac.Axe.axe,
                        conducteur_id = ac.Conducteurs.id,
                        nom_conducteur = ac.Conducteurs.nom,
                        car_id = ac.Cars.id,
                        nom_car = ac.Cars.nom_car,
                        id = ac.id //id de axe_conducteurs
                    })
                    .OrderBy(ac => ac.nom_axe)
                    .ThenBy(ac => ac.nom_conducteur)
                    .ToListAsync();

                return Ok(result);
            }

            [HttpGet("details/{id}")]
            public async Task<ActionResult<object>> GetAxeConducteursCarsDetailsById(int id)
            {
                var result = await _context.Axe_conducteurs_instance
                    .Include(ac => ac.Axe)
                    .Include(ac => ac.Conducteurs)
                    .Include(ac => ac.Cars)
                    .Where(ac => ac.id == id) 
                    .Select(ac => new 
                    {
                        axe_id = ac.Axe.id,
                        nom_axe = ac.Axe.axe,
                        conducteur_id = ac.Conducteurs.id,
                        nom_conducteur = ac.Conducteurs.nom,
                        car_id = ac.Cars.id,
                        nom_car = ac.Cars.nom_car,
                        id = ac.id
                    })
                    .FirstOrDefaultAsync();

                if (result == null)
                {
                    return NotFound("Assignation non trouvée.");
                }

                return Ok(result);
            }




    }
}