// FrequenceController.cs
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using package_push_frequence.DTOs;
using package_my_db_context;

namespace package_push_frequence.Controllers
{
    [ApiController]
    [Route("api/stat")]
    public class FrequenceController : ControllerBase
    {
        private readonly MyDbContext _context;

        public FrequenceController(MyDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// pour avoir sa fréquence de taux d'utilisation le plus répétitifs d'un usager
        [HttpGet("usagers/frequence")]
        public async Task<IActionResult> GetParcoursStatistics(string matricule, int annee)
        {
            if (string.IsNullOrEmpty(matricule))
            {
                return BadRequest("Le matricule est requis.");
            }


            var usagerExiste = await _context.PointageRamassagePushes_instance.AnyAsync(r => r.Matricule == matricule) ||
                               await _context.PointageDepotPushes_instance.AnyAsync(d => d.Matricule == matricule) ||
                               await _context.PointageUsagersImprevuPushes_instance.AnyAsync(i => i.Matricule == matricule);

            if (!usagerExiste)
            {
                return NotFound("Usager non trouvé.");
            }

            // Récupérer les données de ramassage, dépôt et imprévus pour l'usager et l'année spécifiés
            var ramassageData = await _context.PointageRamassagePushes_instance
                .Where(r => r.Matricule == matricule && r.DatetimeRamassage.StartsWith(annee.ToString()))
                .ToListAsync();

            var depotData = await _context.PointageDepotPushes_instance
                .Where(d => d.Matricule == matricule && d.DatetimeDepot.StartsWith(annee.ToString()))
                .ToListAsync();

            var imprevusData = await _context.PointageUsagersImprevuPushes_instance
                .Where(i => i.Matricule == matricule && i.DatetimeImprevu.StartsWith(annee.ToString()))
                .ToListAsync();

            // Calcul des totaux et fréquences pour les ramassages
            var totalRamassage = ramassageData.Count;
            var ramassageFrequency = ramassageData
                .GroupBy(r => r.NomVoiture)
                .Select(g => new CarFrequency
                {
                    NomVoiture = g.Key,
                    Count = g.Count(),
                    Percentage = totalRamassage > 0 ? Math.Round((double)g.Count() / totalRamassage * 100, 2) : 0
                })
                .OrderByDescending(cf => cf.Count)
                .ToList();

            // Calcul des totaux et fréquences pour les dépôts
            var totalDepot = depotData.Count;
            var depotFrequency = depotData
                .GroupBy(d => d.NomVoiture)
                .Select(g => new CarFrequency
                {
                    NomVoiture = g.Key,
                    Count = g.Count(),
                    Percentage = totalDepot > 0 ? Math.Round((double)g.Count() / totalDepot * 100, 2) : 0
                })
                .OrderByDescending(cf => cf.Count)
                .ToList();

            // Calcul des totaux et fréquences pour les imprévus
            var totalImprevu = imprevusData.Count;
            var imprevusFrequency = imprevusData
                .GroupBy(i => i.NomVoiture)
                .Select(g => new CarFrequency
                {
                    NomVoiture = g.Key,
                    Count = g.Count(),
                    Percentage = totalImprevu > 0 ? Math.Round((double)g.Count() / totalImprevu * 100, 2) : 0
                })
                .OrderByDescending(cf => cf.Count)
                .ToList();

            // Calcul des comparaisons mensuelles
            var monthlyComparison = new List<MonthlyTopCar>();
            for (int month = 1; month <= 12; month++)
            {
                // Conversion du numéro du mois en nom du mois en français
                var monthName = CultureInfo.CreateSpecificCulture("fr-FR").DateTimeFormat.GetMonthName(month);

                var ramassageMonth = ramassageData
                    .Where(r =>
                    {
                        if (DateTime.TryParse(r.DatetimeRamassage, out DateTime dt))
                        {
                            return dt.Month == month;
                        }
                        return false;
                    })
                    .ToList();

                var totalRamassageMonth = ramassageMonth.Count;

                var topRamassageCar = ramassageMonth
                    .GroupBy(r => r.NomVoiture)
                    .Select(g => new
                    {
                        NomVoiture = g.Key,
                        Count = g.Count()
                    })
                    .OrderByDescending(g => g.Count)
                    .FirstOrDefault();

                var depotMonth = depotData
                    .Where(d =>
                    {
                        if (DateTime.TryParse(d.DatetimeDepot, out DateTime dt))
                        {
                            return dt.Month == month;
                        }
                        return false;
                    })
                    .ToList();

                var totalDepotMonth = depotMonth.Count;

                var topDepotCar = depotMonth
                    .GroupBy(d => d.NomVoiture)
                    .Select(g => new
                    {
                        NomVoiture = g.Key,
                        Count = g.Count()
                    })
                    .OrderByDescending(g => g.Count)
                    .FirstOrDefault();

                var imprevuMonth = imprevusData
                    .Where(i =>
                    {
                        if (DateTime.TryParse(i.DatetimeImprevu, out DateTime dt))
                        {
                            return dt.Month == month;
                        }
                        return false;
                    })
                    .ToList();

                var totalImprevuMonth = imprevuMonth.Count;

                var topImprevuCar = imprevuMonth
                    .GroupBy(i => i.NomVoiture)
                    .Select(g => new
                    {
                        NomVoiture = g.Key,
                        Count = g.Count()
                    })
                    .OrderByDescending(g => g.Count)
                    .FirstOrDefault();

                monthlyComparison.Add(new MonthlyTopCar
                {
                    Mois = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(monthName),
                    TopRamassageVoiture = topRamassageCar?.NomVoiture ?? "N/A",
                    TopRamassagePercentage = topRamassageCar != null && totalRamassageMonth > 0
                        ? topRamassageCar.Count > 0 ? Math.Round((double)topRamassageCar.Count / totalRamassageMonth * 100, 2) : 0
                        : 0,
                    TopDepotVoiture = topDepotCar?.NomVoiture ?? "N/A",
                    TopDepotPercentage = topDepotCar != null && totalDepotMonth > 0
                        ? topDepotCar.Count > 0 ? Math.Round((double)topDepotCar.Count / totalDepotMonth * 100, 2) : 0
                        : 0,
                    TopImprevuVoiture = topImprevuCar?.NomVoiture ?? "N/A",
                    TopImprevuPercentage = topImprevuCar != null && totalImprevuMonth > 0
                        ? topImprevuCar.Count > 0 ? Math.Round((double)topImprevuCar.Count / totalImprevuMonth * 100, 2) : 0
                        : 0
                });
            }

            // Assemblage de la réponse
            var response = new ParcoursStatisticsResponse
            {
                RamassageFrequency = ramassageFrequency,
                DepotFrequency = depotFrequency,
                ImprevusFrequency = imprevusFrequency,
                MonthlyComparison = monthlyComparison
            };

            return Ok(response);
        }
    }
}
