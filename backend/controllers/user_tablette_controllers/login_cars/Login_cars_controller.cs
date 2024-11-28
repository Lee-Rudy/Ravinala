using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using package_my_db_context;
using package_login_cars;
using System.Runtime.CompilerServices;
using package_prestataire;

//method : POST 
// http://localhost:5218/api/cars/auth

// {
//   "nom_car_login": "car5",
//   "mot_de_passe": "car5!"
// }

// public DbSet<Login_cars> Login_cars_instance { get; set; }

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


        ///<summary>
        ///get all login cars
        
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

//http://localhost:5218/api/cars/auth/update/2
//  {
//      "Id":2,
//     "nom_car_login": "car2",
//     "mot_de_passe": "car2!",
//  }


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
        /// <returns>Statut de l'authentification</returns>
        /// tsy kitiana intsony
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
