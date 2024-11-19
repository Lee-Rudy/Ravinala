using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using package_push_data;
using package_my_db_context;
using Newtonsoft.Json.Linq;

namespace package_push_controller
{
    [Route("api/push")]
    [ApiController]
    public class PushController : ControllerBase
    {
        private readonly MyDbContext _context;

        public PushController(MyDbContext context)
        {
            _context = context;
        }

        // Ajouter un pointage de ramassage
          [HttpPost("sendAll")]
        public async Task<IActionResult> SendAllPushData([FromBody] PushDataRequest request)
        {
            if (request == null)
            {
                return BadRequest("Les données envoyées sont nulles.");
            }

            try
            {
                // Ajout des données de ramassage
                if (request.PointageRamassage != null && request.PointageRamassage.Any())
                {
                    foreach (var ramassage in request.PointageRamassage)
                    {
                        ramassage.RecuLe = DateTime.Now;
                        // Pas besoin de réinitialiser 'Id' grâce à [BindNever]
                    }
                    _context.PointageRamassagePushes_instance.AddRange(request.PointageRamassage);
                    Console.WriteLine($"Ajout de {request.PointageRamassage.Count} pointages de ramassage.");
                }

                // Ajout des données de dépôt
                if (request.PointageDepot != null && request.PointageDepot.Any())
                {
                    foreach (var depot in request.PointageDepot)
                    {
                        depot.RecuLe = DateTime.Now;
                        // Pas besoin de réinitialiser 'Id' grâce à [BindNever]
                    }
                    _context.PointageDepotPushes_instance.AddRange(request.PointageDepot);
                    Console.WriteLine($"Ajout de {request.PointageDepot.Count} pointages de dépôt.");
                }

                // Ajout des données de bouton
                if (request.Btn != null && request.Btn.Any())
                {
                    foreach (var btn in request.Btn)
                    {
                        btn.RecuLe = DateTime.Now;
                        // Pas besoin de réinitialiser 'Id' grâce à [BindNever]
                    }
                    _context.BtnPushes_instance.AddRange(request.Btn);
                    Console.WriteLine($"Ajout de {request.Btn.Count} boutons.");
                }

                // Ajout des données d'usagers imprévus
                if (request.PointageUsagersImprevu != null && request.PointageUsagersImprevu.Any())
                {
                    foreach (var imprévu in request.PointageUsagersImprevu)
                    {
                        imprévu.RecuLe = DateTime.Now;
                        // Pas besoin de réinitialiser 'Id' grâce à [BindNever]
                    }
                    _context.PointageUsagersImprevuPushes_instance.AddRange(request.PointageUsagersImprevu);
                    Console.WriteLine($"Ajout de {request.PointageUsagersImprevu.Count} usagers imprévus.");
                }

                // Sauvegarde dans la base de données
                await _context.SaveChangesAsync();
                Console.WriteLine("Toutes les données ont été sauvegardées avec succès.");

                return Ok("Toutes les données ont été envoyées et enregistrées avec succès.");
            }
            catch (Exception ex)
            {
                // Log l'erreur pour le débogage
                Console.Error.WriteLine($"Erreur lors de l'enregistrement des données: {ex.Message}");
                return StatusCode(500, "Erreur interne du serveur.");
            }
        }


        // Récupérer tous les pointages de ramassage
        [HttpGet("pointageRamassage")]
        public async Task<ActionResult<IEnumerable<Pointage_ramassage_push>>> GetAllPointageRamassage()
        {
            return await _context.PointageRamassagePushes_instance.ToListAsync();
        }

        // Récupérer tous les pointages de dépôt
        [HttpGet("pointageDepot")]
        public async Task<ActionResult<IEnumerable<Pointage_depot_push>>> GetAllPointageDepot()
        {
            return await _context.PointageDepotPushes_instance.ToListAsync();
        }
    }
}

