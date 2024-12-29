// total parcours dans le mois et l'année
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using package_push_controller.DTOs;
using package_my_db_context;
using package_usagers;

namespace package_stat_usagers_controller 
{
    [Route("api/stat")]
    [ApiController]
    public class StatUsagersController : ControllerBase
    {
        private readonly MyDbContext _context;

        public StatUsagersController(MyDbContext context)
        {
            _context = context;
        }

        // Exemple d'URL : http://localhost:5218/api/stat/usagers/trafic?matricule=ST-001&annee=2024
        /// <summary>
        /// pour avoir le trafic des usagers , quelle était le plus empruntés
        [HttpGet("usagers/trafic")]
        public async Task<ActionResult<IEnumerable<UsagerMonthlyStatDTO>>> GetStatUsagersByYear([FromQuery] string matricule, [FromQuery] int annee)
        {
            try
            {
               
                if (string.IsNullOrEmpty(matricule))
                {
                    return BadRequest("Le matricule est requis.");
                }

                if (annee < 1)
                {
                    return BadRequest("L'année doit être valide.");
                }

                var usagerExists = await _context.Usagers_instance.AnyAsync(u => u.matricule == matricule);
                if (!usagerExists)
                {
                    return NotFound($"Aucun usager trouvé avec le matricule {matricule}.");
                }

                var stats = new List<UsagerMonthlyStatDTO>();

                for (int mois = 1; mois <= 12; mois++)
                {
                    var dateDebut = new DateTime(annee, mois, 1);
                    var dateFin = dateDebut.AddMonths(1);

                    string dateDebutStr = dateDebut.ToString("yyyy-MM-ddTHH:mm:ss");
                    string dateFinStr = dateFin.ToString("yyyy-MM-ddTHH:mm:ss");

                    // Récupérer les données de ramassage présents
                    var ramassagePresent = await _context.PointageRamassagePushes_instance
                        .AsNoTracking()
                        .Where(r => r.Matricule == matricule &&
                                    r.EstPresent == "1" && // Vérifie que l'utilisateur est présent
                                    !string.IsNullOrEmpty(r.DatetimeRamassage) && 
                                    r.DatetimeRamassage.CompareTo(dateDebutStr) >= 0 &&
                                    r.DatetimeRamassage.CompareTo(dateFinStr) < 0)
                        .CountAsync();

                    // Récupérer les données de dépôt présents
                    var depotPresent = await _context.PointageDepotPushes_instance
                        .AsNoTracking()
                        .Where(d => d.Matricule == matricule &&
                                    d.EstPresent == "1" &&
                                    !string.IsNullOrEmpty(d.DatetimeDepot) &&
                                    d.DatetimeDepot.CompareTo(dateDebutStr) >= 0 &&
                                    d.DatetimeDepot.CompareTo(dateFinStr) < 0)
                        .CountAsync();

                    // Récupérer les données des imprévus
                    var imprévus = await _context.PointageUsagersImprevuPushes_instance
                        .AsNoTracking()
                        .Where(i => i.Matricule == matricule &&
                                    !string.IsNullOrEmpty(i.DatetimeImprevu) &&
                                    i.DatetimeImprevu.CompareTo(dateDebutStr) >= 0 &&
                                    i.DatetimeImprevu.CompareTo(dateFinStr) < 0)
                        .ToListAsync();

                    // Calculer les imprévus pour ramassage et dépôt
                    int ramassageImprevu = 0;
                    int depotImprevu = 0;
                    foreach (var imprévu in imprévus)
                    {
                        if (DateTime.TryParse(imprévu.DatetimeImprevu, out DateTime datetime))
                        {
                            var time = datetime.TimeOfDay;
                            if (time < new TimeSpan(15, 30, 0))
                            {
                                ramassageImprevu++;
                            }
                            else
                            {
                                depotImprevu++;
                            }
                        }
                    }

                    // Ajouter les statistiques du mois à la liste
                    stats.Add(new UsagerMonthlyStatDTO
                    {
                        Mois = mois,
                        Annee = annee,
                        RamassagePresent = ramassagePresent,
                        RamassageImprevu = ramassageImprevu,
                        DepotPresent = depotPresent,
                        DepotImprevu = depotImprevu
                    });
                }

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Une erreur interne est survenue.",
                    error = ex.Message,
                    stackTrace = ex.StackTrace 
                });
            }
        }

    }
}
