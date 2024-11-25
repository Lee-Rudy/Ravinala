using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using package_push_data;
using package_my_db_context;

namespace package_stat_cars_controller
{
    [Route("api/stat")]
    [ApiController]
    public class StatCarsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public StatCarsController(MyDbContext context)
        {
            _context = context;
        }

        // ===============================
        // 1. Nombre de retards et taux de ponctualité
        // ===============================

        /// <summary>
        /// Obtient le nombre total de retards pour toutes les cars sur une année donnée (ramassage seulement).
        /// Exemple d'URL : /api/stat/cars/total?year=2024
        /// </summary>
        /// check
        [HttpGet("cars/total")]
        public async Task<IActionResult> GetTotalDelays(int year)
        {
            string yearStr = year.ToString();
            string delayedTimeStr = "07:30:00";
            string delayedTimeStr2 = "15:30:00";


            var totalDelays = await _context.BtnPushes_instance
                .Where(pr =>
                    pr.DatetimeArrivee.Length >= 19 && // Vérifier la longueur pour éviter les erreurs
                    pr.DatetimeArrivee.Substring(0, 4) == yearStr && // Extraire l'année
                    pr.DatetimeArrivee.Substring(11, 8).CompareTo(delayedTimeStr) > 0 || pr.DatetimeArrivee.Substring(11, 8).CompareTo(delayedTimeStr2) > 0) // Vérifier si l'heure est après 07:30:00
                .CountAsync();

            return Ok(new { Year = year, TotalDelays = totalDelays });
        }

        /// <summary>
        /// Obtient le nombre total de retards par mois pour toutes les cars sur une année donnée (ramassage seulement).
        /// Exemple d'URL : /api/stat/cars/delaysbymonth?year=2024
        /// </summary>
        /// par mois seulement si il existe
        [HttpGet("cars/delaysbymonth")]
        public async Task<IActionResult> GetDelaysByMonth(int year)
        {
            string delayedTimeMorning = "07:30:00";
            string delayedTimeAfternoon = "15:30:00";

            var delaysByMonth = await _context.BtnPushes_instance
                .Where(pr =>
                    pr.DatetimeArrivee.Length >= 19 &&
                    EF.Functions.Like(pr.DatetimeArrivee, $"{year}-%") && // Vérifie que l'année correspond
                    (string.Compare(pr.DatetimeArrivee.Substring(11, 8), delayedTimeMorning) > 0 || 
                    string.Compare(pr.DatetimeArrivee.Substring(11, 8), delayedTimeAfternoon) > 0))
                .GroupBy(pr => pr.DatetimeArrivee.Substring(5, 2)) // Extraire le mois
                .Select(g => new 
                { 
                    Month = g.Key, 
                    Delays = g.Count() 
                })
                .OrderBy(x => x.Month)
                .ToListAsync();

            var result = delaysByMonth.Select(x => new 
            { 
                Month = int.Parse(x.Month), // Conversion en entier après la récupération
                Delays = x.Delays 
            }).OrderBy(x => x.Month);

            return Ok(new { Year = year, DelaysByMonth = result });
        }


        /// <summary>
        /// Obtient le nombre total de retards par mois pour un car spécifique sur une année donnée (ramassage seulement).
        /// Exemple d'URL : /api/stat/cars/delaysbycarandmonth?carName=CarA&year=2024
        /// </summary>
        /// http://localhost:5218/api/stat/cars/delaysbycarandmonth?carName=car3&year=2024
        /// vita
        [HttpGet("cars/delaysbycarandmonth")]
        public async Task<IActionResult> GetDelaysByCarAndMonth(string carName, int year)
        {
            string delayedTimeStr = "07:30:00";
            string delayedTimeAfternoon = "15:30:00";


            var delays = await _context.BtnPushes_instance
                .Where(pr =>
                    pr.NomVoiture.ToLower() == carName.ToLower() && // Comparaison insensible à la casse
                    EF.Functions.Like(pr.DatetimeArrivee, $"{year}-%") && // Vérifie l'année
                    string.Compare(pr.DatetimeArrivee.Substring(11, 8), delayedTimeStr) > 0 || string.Compare(pr.DatetimeArrivee.Substring(11, 8), delayedTimeAfternoon) > 0)
                .GroupBy(pr => pr.DatetimeArrivee.Substring(5, 2)) // Extraire le mois
                .Select(g => new 
                { 
                    Month = g.Key, // La clé ici est une chaîne (mois sous forme de texte "01", "02", etc.)
                    Delays = g.Count() 
                })
                .ToListAsync();

            // Conversion du mois en entier après récupération des données
            var result = delays.Select(x => new 
            { 
                Month = int.Parse(x.Month), 
                Delays = x.Delays 
            }).OrderBy(x => x.Month);

            return Ok(new { Car = carName, Year = year, DelaysByMonth = result });
        }



        /// <summary>
        /// Obtient le taux de ponctualité pour toutes les cars sur une année donnée (ramassage seulement).
        /// Exemple d'URL : /api/stat/cars/ponctualityrate?year=2024
        /// </summary>
        /// Le taux de ponctualité retourné par ce contrôleur représente le pourcentage des cars confondues qui arrivent avant 07:30:00 (c'est-à-dire, ponctuels).
        /// vita
        /// eto zao
        [HttpGet("cars/ponctualityrate")]
        public async Task<IActionResult> GetPunctualityRate(int year)
        {
            string yearStr = year.ToString();
            string delayedTimeStr = "07:30:00";

            var total = await _context.BtnPushes_instance
                .Where(pr =>
                    pr.DatetimeArrivee.Length >= 19 &&
                    pr.DatetimeArrivee.Substring(0, 4) == yearStr)
                .CountAsync();

            var delayed = await _context.BtnPushes_instance
                .Where(pr =>
                    pr.DatetimeArrivee.Length >= 19 &&
                    pr.DatetimeArrivee.Substring(0, 4) == yearStr &&
                    pr.DatetimeArrivee.Substring(11, 8).CompareTo(delayedTimeStr) > 0)
                .CountAsync();

            var punctualityRate = total > 0 ? ((double)(total - delayed) / total) * 100 : 0;

            return Ok(new { Year = year, PunctualityRate = punctualityRate });
        }

        // ===============================
        // 2. Moyenne de nombre de passagers
        // ===============================

        /// <summary>
        /// Obtient la moyenne de passagers pour un car spécifique sur une année donnée, avec détail par mois.
        /// Exemple d'URL : /api/stat/passengers/average?carName=CarA&year=2024
        /// </summary>
        /// eto ndray zao 
        [HttpGet("cars/passengers/average")]
            public async Task<IActionResult> GetAveragePassengers(string carName, int year)
            {
                string yearStr = year.ToString();

                // Ramassage
                var passengersByMonthRamassage = await _context.PointageRamassagePushes_instance
                    .Where(pr =>
                        pr.NomVoiture.ToLower() == carName.ToLower() &&
                        pr.DatetimeRamassage.StartsWith(yearStr) &&
                        pr.EstPresent == "1")
                    .GroupBy(pr => new { Month = pr.DatetimeRamassage.Substring(5, 2), pr.Matricule })
                    .Select(g => new { g.Key.Month, Passengers = g.Count() })
                    .ToListAsync();

                // Dépôt
                var passengersByMonthDepot = await _context.PointageDepotPushes_instance
                    .Where(pd =>
                        pd.NomVoiture.ToLower() == carName.ToLower() &&
                        pd.DatetimeDepot.StartsWith(yearStr) &&
                        pd.EstPresent == "1")
                    .GroupBy(pd => new { Month = pd.DatetimeDepot.Substring(5, 2), pd.Matricule })
                    .Select(g => new { g.Key.Month, Passengers = g.Count() })
                    .ToListAsync();

                // Imprévus
                var passengersByMonthImprevus = await _context.PointageUsagersImprevuPushes_instance
                    .Where(pi =>
                        pi.NomVoiture.ToLower() == carName.ToLower() &&
                        pi.DatetimeImprevu.StartsWith(yearStr))
                    .GroupBy(pi => new { Month = pi.DatetimeImprevu.Substring(5, 2), pi.Matricule })
                    .Select(g => new { g.Key.Month, Passengers = g.Count() })
                    .ToListAsync();

                // Fusion des données mensuelles
                var passengersByMonth = new List<object>();
                int totalPassengers = 0;
                int activeMonths = 0; // Mois où il y a au moins un passager

                for (int month = 1; month <= 12; month++)
                {
                    string monthStr = month.ToString("D2");
                    var ramassage = passengersByMonthRamassage
                        .Where(p => p.Month == monthStr)
                        .Sum(p => p.Passengers);

                    var depot = passengersByMonthDepot
                        .Where(p => p.Month == monthStr)
                        .Sum(p => p.Passengers);

                    var imprevu = passengersByMonthImprevus
                        .Where(p => p.Month == monthStr)
                        .Sum(p => p.Passengers);

                    int monthlyPassengers = ramassage + depot + imprevu;

                    // Ajouter au total global
                    totalPassengers += monthlyPassengers;

                    // Compter les mois actifs
                    if (monthlyPassengers > 0)
                    {
                        activeMonths++;
                    }

                    passengersByMonth.Add(new
                    {
                        Month = month,
                        Passengers = monthlyPassengers
                    });
                }

                // Calcul de la moyenne
                double averagePassengers = activeMonths > 0 ? (double)totalPassengers / activeMonths : 0;

                // Résultat final
                return Ok(new
                {
                    Car = carName,
                    Year = year,
                    TotalPassengers = totalPassengers,
                    AveragePassengers = averagePassengers,
                    PassengersByMonth = passengersByMonth
                });
            }
            


            [HttpGet("cars/passengers/average/ramassage-depot")]
public async Task<IActionResult> GetAveragePassengersByRamassageAndDepot(string carName, int year)
{
    string yearStr = year.ToString();

    // Ramassage
    var passengersByMonthRamassage = await _context.PointageRamassagePushes_instance
        .Where(pr =>
            pr.NomVoiture.ToLower() == carName.ToLower() &&
            pr.DatetimeRamassage.StartsWith(yearStr) &&
            pr.EstPresent == "1")
        .GroupBy(pr => new { Month = pr.DatetimeRamassage.Substring(5, 2) })
        .Select(g => new { g.Key.Month, Passengers = g.Count() })
        .ToListAsync();

    // Dépôt
    var passengersByMonthDepot = await _context.PointageDepotPushes_instance
        .Where(pd =>
            pd.NomVoiture.ToLower() == carName.ToLower() &&
            pd.DatetimeDepot.StartsWith(yearStr) &&
            pd.EstPresent == "1")
        .GroupBy(pd => new { Month = pd.DatetimeDepot.Substring(5, 2) })
        .Select(g => new { g.Key.Month, Passengers = g.Count() })
        .ToListAsync();

    // Calcul des moyennes
    int totalRamassagePassengers = passengersByMonthRamassage.Sum(p => p.Passengers);
    int totalDepotPassengers = passengersByMonthDepot.Sum(p => p.Passengers);

    int activeRamassageMonths = passengersByMonthRamassage.Count(p => p.Passengers > 0);
    int activeDepotMonths = passengersByMonthDepot.Count(p => p.Passengers > 0);

    double averageRamassagePassengers = activeRamassageMonths > 0 
        ? (double)totalRamassagePassengers / activeRamassageMonths 
        : 0;

    double averageDepotPassengers = activeDepotMonths > 0 
        ? (double)totalDepotPassengers / activeDepotMonths 
        : 0;

    // Résultat final
    return Ok(new
    {
        Car = carName,
        Year = year,
        TotalRamassagePassengers = totalRamassagePassengers,
        AverageRamassagePassengers = averageRamassagePassengers,
        TotalDepotPassengers = totalDepotPassengers,
        AverageDepotPassengers = averageDepotPassengers,
        PassengersByMonthRamassage = passengersByMonthRamassage,
        PassengersByMonthDepot = passengersByMonthDepot
    });
}






























        [HttpGet("cars/passengers/total")]
        public async Task<IActionResult> GetTotalRamassageDepotImprevus(string carName, int year)
        {
            string yearStr = year.ToString();

            // Ramassage
            var totalRamassage = await _context.PointageRamassagePushes_instance
                .Where(pr =>
                    pr.NomVoiture.ToLower() == carName.ToLower() &&
                    pr.DatetimeRamassage.StartsWith(yearStr) &&
                    pr.EstPresent == "1")
                .GroupBy(pr => pr.Matricule) // Comptage unique par matricule
                .CountAsync();

            // Dépôt
            var totalDepot = await _context.PointageDepotPushes_instance
                .Where(pd =>
                    pd.NomVoiture.ToLower() == carName.ToLower() &&
                    pd.DatetimeDepot.StartsWith(yearStr) &&
                    pd.EstPresent == "1")
                .GroupBy(pd => pd.Matricule) // Comptage unique par matricule
                .CountAsync();

            // Imprévus
            var totalImprevus = await _context.PointageUsagersImprevuPushes_instance
                .Where(pi =>
                    pi.NomVoiture.ToLower() == carName.ToLower() &&
                    pi.DatetimeImprevu.StartsWith(yearStr))
                .GroupBy(pi => pi.Matricule) // Comptage unique par matricule
                .CountAsync();

            // Calculs combinés
            var totalRamassagePlusImprevus = totalRamassage + totalImprevus;
            var totalDepotPlusImprevus = totalDepot + totalImprevus;

            // Résultat final
            return Ok(new
            {
                Car = carName,
                Year = year,
                TotalRamassagePlusImprevus = totalRamassagePlusImprevus,
                TotalDepotPlusImprevus = totalDepotPlusImprevus,
                TotalImprevus = totalImprevus
            });
        }
    }
}
