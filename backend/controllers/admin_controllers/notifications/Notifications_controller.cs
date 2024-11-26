using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using package_push_controller.DTOs; // Importer les DTOs
using package_push_data;
using package_my_db_context;
using Microsoft.Extensions.Logging;

namespace package_push_controller
{
    [Route("api/notifications")]
    [ApiController]
    public class Notifications_controller : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ILogger<Notifications_controller> _logger;

        public Notifications_controller(MyDbContext context, ILogger<Notifications_controller> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Récupérer tous les nouvelles lignes de notifications basés sur recu_le 
        //toutes les 30 sécondes , effectués cette requêtes depuis le front : interroger le server tout les 30 secondes et recupérés les 50 derniers lignes pour vérifiers si il a des nouvelles lignes disponibles

        //AVANTAGES
        ///<summary> 
        ///Avantages de Cette Approche :
        ///
        // Réduction de la Charge :

        // Seules les nouvelles données pertinentes (max 50) sont retournées, limitant la bande passante utilisée.
        // Flexibilité :

        // Cette méthode peut s’adapter à une croissance du volume des données (exemple : plus de cars ou des pushs plus fréquents).
        // Optimisation :

        // En triant et en limitant les résultats, vous réduisez le temps de traitement côté serveur et optimisez les performances.

       [HttpGet("pointageRamassage")]
        public async Task<ActionResult<IEnumerable<Pointage_ramassage_push>>> GetNewPointageRamassage(DateTime lastChecked)
        {
            return await _context.PointageRamassagePushes_instance
                .Where(p => p.RecuLe > lastChecked) // Filtre sur la date
                .OrderByDescending(p => p.RecuLe)   // Tri par date la plus récente
                .Take(30)                           // Limit by aux 30 dernières entrées
                .ToListAsync();
        }

        // Exemple : Ajouter une méthode pour marquer toutes les notifications comme lues
// [HttpPost("markAllAsRead")]
// public async Task<IActionResult> MarkAllAsRead()
// {
//     // Marquer toutes les notifications d'axe comme lues
//     var axeNotifications = await _context.Axe_instance.Where(a => !a.IsRead).ToListAsync();
//     foreach (var axe in axeNotifications)
//     {
//         axe.IsRead = true;
//     }

//     // Marquer toutes les notifications de pointageRamassage comme lues
//     var pushNotifications = await _context.PointageRamassagePushes_instance.Where(p => !p.IsRead).ToListAsync();
//     foreach (var push in pushNotifications)
//     {
//         push.IsRead = true;
//     }

//     await _context.SaveChangesAsync();
//     return Ok();
// }


    }
}
