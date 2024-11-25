using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net; // Pour BCrypt
using package_my_db_context;
using package_login;

namespace package_login_controller
{
    [Route("api/login")]
    [ApiController]
    public class Login_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Login_controller(MyDbContext context)
        {
            _context = context;
        }

        // Endpoint pour la connexion
        [HttpPost("identification")]
        public async Task<IActionResult> Authenticate([FromBody] Login loginRequest)
        {
            if (loginRequest.mail == null || loginRequest.mot_de_passe == null)
            {
                return BadRequest(new { message = "Email et mot de passe sont requis." });
            }

            var user = await _context.Login_instance
                .Where(u => u.mail == loginRequest.mail)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return Unauthorized(new { message = "Utilisateur non trouvé." });
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginRequest.mot_de_passe, user.mot_de_passe);

            if (!isPasswordValid)
            {
                return Unauthorized(new { message = "Mot de passe incorrect." });
            }

            // Si tout est correct, retourner les informations de l'utilisateur avec l'URL de redirection
            return Ok(new
            {
                id = user.id,
                nom = user.nom,
                mail = user.mail,
                est_admin = user.est_admin,
                // redirectUrl = user.est_admin == true ? "/dashboard_admin" : "/push" // URL selon le type d'utilisateur
                redirectUrl = user.est_admin == true ? "/historique" : "/push"
            });
        }

    }
}


//autre méthode de Login
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using System.Linq;
// using System.Threading.Tasks;


// using package_my_db_context;
// using package_login;

// namespace package_login_controller
// {
//     [Route("api/login")]
//     [ApiController]
//     public class LoginController : ControllerBase
//     {
//         private readonly MyDbContext _context;

//         public LoginController(MyDbContext context)
//         {
//             _context = context;
//         }

//         // Endpoint pour la connexion
//         [HttpPost("identification")]
//         public async Task<IActionResult> Authenticate([FromBody] LoginModel loginModel)
//         {
//             if (loginModel.mail == null || loginModel.mot_de_passe == null)
//             {
//                 return BadRequest(new { message = "Email et mot de passe sont requis." });
//             }

//             // Recherche l'utilisateur par email
//             var user = await _context.Login_instance
//                 .Where(u => u.mail == loginModel.mail)
//                 .FirstOrDefaultAsync();

//             if (user == null)
//             {
//                 return Unauthorized(new { message = "Utilisateur non trouvé." });
//             }

//             // Vérification du mot de passe avec BCrypt
//             if (!BCrypt.Net.BCrypt.Verify(loginModel.mot_de_passe, user.mot_de_passe))
//             {
//                 return Unauthorized(new { message = "Mot de passe incorrect." });
//             }

//             // Si tout est correct, retourner les informations de l'utilisateur
//             return Ok(new
//             {
//                 id = user.id,
//                 nom = user.nom,
//                 mail = user.mail,
//                 est_admin = user.est_admin
//             });
//         }
//     }

    // Modèle pour recevoir les informations de connexion
    //explication : pour le méthode post les informations seront passées ici puis réetulisé dans le controller Authenticate

    //La classe Login contient toutes les informations sur l'utilisateur, y compris le mot de passe chiffré. Utiliser directement ce modèle peut exposer des données sensibles ou inutiles dans les requêtes.

    // Avec LoginModel, on ne transmet que les informations nécessaires (comme l'email et le mot de passe non chiffré) sans exposer des champs comme id ou est_admin.

    //Login représente l'entité de base de données, contenant tous les champs de la table utilisateurs.

    //LoginModel est un Data Transfer Object (DTO) utilisé pour transporter les données de l'interface utilisateur (comme l'email et le mot de passe dans ce cas) lors de l'authentification.


    // public class LoginModel
    // {
    //     public string? mail { get; set; }
    //     public string? mot_de_passe { get; set; }
    // }
//}
