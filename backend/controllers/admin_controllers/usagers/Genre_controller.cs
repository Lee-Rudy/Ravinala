using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_genre;
using package_my_db_context;

namespace package_genre_controller
{

    [Route("api/genre")]
    [ApiController]
    public class Genre_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Genre_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<Genre>>> GetGenre()
        {
            return await _context.Genre_instance.ToListAsync();
        }

        //ajout genre
        [HttpPost("ajout")]

        public async Task<ActionResult<Genre>> addGenre(Genre request)
        {
            _context.Genre_instance.Add(request);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGenre", new{id = request.id}, request);
        }


        //update
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateGenre(int id, Genre request)
        {
            var g = await _context.Genre_instance.FindAsync(id);

            if(g == null)
            {
                return NotFound("echec de modification de du genre.");
            }

            g.genre = request.genre;

            _context.Genre_instance.Update(g);
            await _context.SaveChangesAsync();

            return Ok(g);
        }

        //delete
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteGenre(int id)
        {
            var g = await _context.Genre_instance.FindAsync(id);

            if (g == null)
            {
                return NotFound("l'identifiant de l'axe est introuvable, echec de la suppression");
            }

            _context.Genre_instance.Remove(g);
            await _context.SaveChangesAsync();

            return Ok($"la supressrion de l'axe {g.genre} a été supprimé");
        }
       
    }

}