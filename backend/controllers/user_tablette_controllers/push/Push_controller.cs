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
    [Route("api/push")]
    [ApiController]
    public class PushController : ControllerBase
    {
        private readonly MyDbContext _context;
        private readonly ILogger<PushController> _logger;

        public PushController(MyDbContext context, ILogger<PushController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("sendAll")]
        public async Task<IActionResult> SendAllPushData([FromBody] PushDataRequestDTO request)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Les données envoyées ne sont pas valides.");
                return BadRequest(ModelState);
            }

            try
            {
                // Ajout des données de ramassage
                if (request.PointageRamassage != null && request.PointageRamassage.Any())
                {
                    var ramassages = request.PointageRamassage.Select(r => new Pointage_ramassage_push
                    {
                        Matricule = r.Matricule,
                        NomUsager = r.NomUsager,
                        NomVoiture = r.NomVoiture,
                        DatetimeRamassage = r.DatetimeRamassage,  // Enregistrer en tant que string
                        EstPresent = r.EstPresent,  // Enregistrer en tant que string
                        RecuLe = DateTime.Now
                    }).ToList();

                    _context.PointageRamassagePushes_instance.AddRange(ramassages);
                    _logger.LogInformation($"Ajout de {ramassages.Count} pointages de ramassage.");
                }

                // Ajout des données de dépôt
                if (request.PointageDepot != null && request.PointageDepot.Any())
                {
                    var depots = request.PointageDepot.Select(d => new Pointage_depot_push
                    {
                        Matricule = d.Matricule,
                        NomUsager = d.NomUsager,
                        NomVoiture = d.NomVoiture,
                        DatetimeDepot = d.DatetimeDepot,  // Enregistrer en tant que string
                        EstPresent = d.EstPresent,  // Enregistrer en tant que string
                        RecuLe = DateTime.Now
                    }).ToList();

                    _context.PointageDepotPushes_instance.AddRange(depots);
                    _logger.LogInformation($"Ajout de {depots.Count} pointages de dépôt.");
                }

                // Ajout des données de bouton
                if (request.Btn != null && request.Btn.Any())
                {
                var boutons = request.Btn.Select(b => new Btn_push
                {
                    NomVoiture = b.NomVoiture,
                    DatetimeDepart = b.DatetimeDepart == null ? null : b.DatetimeDepart.ToString(),
                    DatetimeArrivee = b.DatetimeArrivee == null ? null : b.DatetimeArrivee.ToString(),
                    RecuLe = DateTime.Now
                                // Format standard pour stocker en string
                }).ToList();


                    _context.BtnPushes_instance.AddRange(boutons);
                    _logger.LogInformation($"Ajout de {boutons.Count} boutons.");
                }

                // Ajout des données d'usagers imprévus
                if (request.PointageUsagersImprevu != null && request.PointageUsagersImprevu.Any())
                {
                    var imprévus = request.PointageUsagersImprevu.Select(i => new Pointage_usagers_imprevu_push
                    {
                        Matricule = i.Matricule,
                        nom = i.nom,
                        NomVoiture = i.NomVoiture,
                        DatetimeImprevu = i.DatetimeImprevu,  // Enregistrer en tant que string
                        RecuLe = DateTime.Now
                    }).ToList();

                    _context.PointageUsagersImprevuPushes_instance.AddRange(imprévus);
                    _logger.LogInformation($"Ajout de {imprévus.Count} usagers imprévus.");
                }

                //ajout ddonnées de km_matin
                if (request.KmMatin != null && request.KmMatin.Any())
                {
                    var matin = request.KmMatin.Select(i => new km_matin_push
                    {
                        Depart = i.Depart,
                        Fin = i.Fin,
                        NomVoiture = i.NomVoiture,
                        DatetimeMatin = i.DatetimeMatin,  // Enregistrer en tant que string
                        RecuLe = DateTime.Now
                    }).ToList();

                    _context.Km_matin_push_instance.AddRange(matin);
                    _logger.LogInformation($"Ajout de {matin.Count} km matin.");
                }

                //ajout ddonnées de km_soir
                if (request.KmSoir != null && request.KmSoir.Any())
                {
                    var soir = request.KmSoir.Select(i => new km_soir_push
                    {
                        Depart = i.Depart,
                        Fin = i.Fin,
                        NomVoiture = i.NomVoiture,
                        DatetimeSoir = i.DatetimeSoir,  // Enregistrer en tant que string
                        RecuLe = DateTime.Now
                    }).ToList();

                    _context.Km_soir_push_instance.AddRange(soir);
                    _logger.LogInformation($"Ajout de {soir.Count} km soir.");
                }

                // Sauvegarde dans la base de données
                await _context.SaveChangesAsync();
                _logger.LogInformation("Toutes les données ont été sauvegardées avec succès.");

                return Ok("Toutes les données ont été envoyées et enregistrées avec succès.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erreur lors de l'enregistrement des données: {ex.Message}");
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
