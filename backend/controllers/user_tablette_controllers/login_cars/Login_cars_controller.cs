using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using package_my_db_context;
using package_login_cars;
using System.Runtime.CompilerServices;
using package_prestataire;

///<summary>
///le nom de l'utilisateur pour le login du car doit être strictement pareil et exacte comme le nom du car du véhicule

namespace package_login_cars.Controllers
{
    [Route("api/cars")]
    [ApiController]
    public class Login_cars_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Login_cars_controller(MyDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("auth/liste")]
        public async Task<ActionResult<IEnumerable<Login_cars>>> GetLogin_cars()
        {
            return await _context.Login_cars_instance.ToListAsync();
        } 


        [HttpGet("auth/liste/{id}")]
        public async Task<ActionResult<Login_cars>> GetLogin_carsById(int id)
        {
            var car_login = await _context.Login_cars_instance.FindAsync(id);

            if (car_login == null)
            {
                return NotFound("identifiant du car introuvable");
            }

            return car_login;
        }


        //update
        [HttpPut("auth/update/{id}")]
        public async Task<IActionResult> UpdateLogin_car(int id, [FromBody] Login_cars login_car)
        {
            if (id != login_car.Id)
            {
                return BadRequest("Identifiant du car est invalide, réssayer !");
            }

            _context.Entry(login_car).State = EntityState.Modified;

            try 
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Login_cars_instance.Any(e => e.Id == id))
                {
                    return NotFound("identifiant introuvale");
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        /// <summary>
        /// Authentifie un utilisateur en vérifiant le nom et le mot de passe.
        /// </summary>
        /// <param name="nom_car_login">Le nom de l'utilisateur</param>
        /// <param name="mot_de_passe">Le mot de passe de l'utilisateur</param>
        [HttpPost("auth")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.nom_car_login) || string.IsNullOrEmpty(request.mot_de_passe))
            {
                return BadRequest(new { message = "Le nom et le mot de passe sont obligatoires." });
            }

            var user = await Task.Run(() =>
                _context.Set<Login_cars>().FirstOrDefault(u => 
                    u.nom_car_login == request.nom_car_login && 
                    u.mot_de_passe == request.mot_de_passe));

            if (user == null)
            {
                return Unauthorized(new { message = "Nom ou mot de passe incorrect." });
            }

            return Ok(new
            {
                message = "Authentification réussie.",
                user = new { user.Id, user.nom_car_login }
            });
        }


        ///<summary>
        /// Ajoute un nouvel enregistrement Login_cars.
        ///</summary>
        [HttpPost("auth/create")]
        public async Task<ActionResult<Login_cars>> AddLogin_car([FromBody] Login_cars newLoginCar)
        {
            if (string.IsNullOrEmpty(newLoginCar.nom_car_login) || string.IsNullOrEmpty(newLoginCar.mot_de_passe))
            {
                return BadRequest("Le nom et le mot de passe sont obligatoires.");
            }

            _context.Login_cars_instance.Add(newLoginCar);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLogin_carsById), new { id = newLoginCar.Id }, newLoginCar);
        }

        ///<summary>
        /// Supprime un enregistrement Login_cars par son ID.
        ///</summary>
        [HttpDelete("auth/delete/{id}")]
        public async Task<IActionResult> DeleteLogin_car(int id)
        {
            var car_login = await _context.Login_cars_instance.FindAsync(id);

            if (car_login == null)
            {
                return NotFound("Identifiant introuvable");
            }

            _context.Login_cars_instance.Remove(car_login);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    /// <summary>
    /// Requête pour l'authentification
    /// </summary>
    public class LoginRequest
    {
        public string nom_car_login { get; set; }
        public string mot_de_passe { get; set; }
    }
}
