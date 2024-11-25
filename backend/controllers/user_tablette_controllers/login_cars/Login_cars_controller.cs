using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

using package_my_db_context;

//method : POST 
// http://localhost:5218/api/cars/auth

// {
//   "nom_car_login": "car5",
//   "mot_de_passe": "car5!"
// }

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

        /// <summary>
        /// Authentifie un utilisateur en vérifiant le nom et le mot de passe.
        /// </summary>
        /// <param name="nom_car_login">Le nom de l'utilisateur</param>
        /// <param name="mot_de_passe">Le mot de passe de l'utilisateur</param>
        /// <returns>Statut de l'authentification</returns>
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
