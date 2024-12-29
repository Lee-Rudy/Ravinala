using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using package_my_db_context;

namespace package_stat_cars_controller
{
    [Route("api/stat/conso")]
    [ApiController]
    public class StatConsommationController : ControllerBase
    {
        private readonly MyDbContext _context;

        public StatConsommationController(MyDbContext context)
        {
            _context = context;
        }
        

        /// <summary>
        /// Statistique flexible pour une liste de voitures et une plage de dates.
        /// c'est à dire avec possibilité de choisir un date début et date fin
        /// </summary>
        /// http://localhost:5218/api/stat/conso/ranking/totalcost?cars=car1&cars=car2&startDate=2024-11-18&endDate=2024-11-19
        /// http://localhost:5218/api/stat/conso/ranking/totalcost?cars=car1&cars=car2&cars=car3&startDate=2024-11-19&endDate=2024-11-19


        [HttpGet("ranking/totalcost")]
        public async Task<IActionResult> GetTotalCostForCars(
            [FromQuery] List<string> cars,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            // check date condition
            if (startDate > endDate)
            {
                return BadRequest("La date de début doit être antérieure ou égale à la date de fin.");
            }

            string startStr = startDate.ToString("yyyy-MM-dd");
            string endStr = endDate.AddDays(1).ToString("yyyy-MM-dd");

            // Normaliser les noms des voitures en minuscules pour la comparaison
            List<string> normalizedCars = cars?.Select(c => c.ToLower()).ToList();

            // Récupérer les trajets du matin
            var kmMatin = GetKmData(
                _context.Km_matin_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeMatin = km.DatetimeMatin,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                startStr,
                endStr,
                isMatin: true,
                selectedCars: normalizedCars); // checkBox de choix d'une ou des voitures

            // Récupérer les trajets du soir
            var kmSoir = GetKmData(
                _context.Km_soir_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeSoir = km.DatetimeSoir,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                startStr,
                endStr,
                isMatin: false,
                selectedCars: normalizedCars);// checkBox de choix d'une ou des voitures

            // Calculer les coûts
            var result = await CalculateTotalCost(kmMatin, kmSoir, $"{startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}");

            return result;
        }


        private List<TripData> GetKmData(
            IQueryable<KmData> query,
            string start,
            string end,
            bool isMatin,
            List<string> selectedCars = null)
        {
            var filteredQuery = query.Where(km =>
                km.NomVoiture != null &&
                string.Compare(isMatin ? km.DatetimeMatin : km.DatetimeSoir, start) >= 0 &&
                string.Compare(isMatin ? km.DatetimeMatin : km.DatetimeSoir, end) < 0
            );

            if (selectedCars != null && selectedCars.Any())
            {
                filteredQuery = filteredQuery.Where(km => selectedCars.Contains(km.NomVoiture.ToLower()));
            }

            return filteredQuery
                .AsEnumerable()
                .Select(km =>
                {
                    double finKm = 0.0;
                    double departKm = 0.0;
                    double distance = 0.0;
                    bool parsedFin = double.TryParse(km.Fin, out finKm);
                    bool parsedDepart = double.TryParse(km.Depart, out departKm);
                    if (parsedFin && parsedDepart)
                    {
                        distance = finKm - departKm;
                        if (distance < 0)
                        {
                            distance = 0.0; // valeur par défaut si il y a une distance négatives
                        }
                    }

                    return new TripData
                    {
                        NomVoiture = km.NomVoiture.ToLower(),
                        TotalKmMatin = isMatin ? distance : 0.0,
                        TotalKmSoir = isMatin ? 0.0 : distance
                    };
                })
                .GroupBy(td => td.NomVoiture)
                .Select(g => new TripData
                {
                    NomVoiture = g.Key,
                    TotalKmMatin = g.Sum(td => td.TotalKmMatin),
                    TotalKmSoir = g.Sum(td => td.TotalKmSoir)
                })
                .ToList();
        }

        /// <summary>
        /// Méthode pour calculer les coûts.
        /// </summary>
        private async Task<IActionResult> CalculateTotalCost(
            List<TripData> kmMatin,
            List<TripData> kmSoir,
            string period)
        {
            var cars = await _context.Cars_instance.ToListAsync();

            //dictionnaire pour les trajets du soir
            var soirDict = kmSoir.ToDictionary(km => km.NomVoiture, km => km.TotalKmSoir);

            // Grouper les trajets du matin et du soir
            var combinedTrips = kmMatin.Select(matin => new
            {
                NomVoiture = matin.NomVoiture,
                TotalKmMatin = matin.TotalKmMatin,
                TotalKmSoir = soirDict.ContainsKey(matin.NomVoiture) ? soirDict[matin.NomVoiture] : 0.0,
                TotalKm = matin.TotalKmMatin + (soirDict.ContainsKey(matin.NomVoiture) ? soirDict[matin.NomVoiture] : 0.0)
            }).ToList();

            var matinCars = new HashSet<string>(kmMatin.Select(km => km.NomVoiture));
            var additionalSoirTrips = kmSoir.Where(km => !matinCars.Contains(km.NomVoiture)).Select(km => new
            {
                NomVoiture = km.NomVoiture,
                TotalKmMatin = 0.0,
                TotalKmSoir = km.TotalKmSoir,
                TotalKm = km.TotalKmSoir
            }).ToList();

            combinedTrips.AddRange(additionalSoirTrips);

            // Calculer le coût total par voiture
            var totalCostPerCar = combinedTrips.Select(car =>
            {
                var carData = cars.FirstOrDefault(c => c.nom_car != null && c.nom_car.ToLower() == car.NomVoiture);
                if (carData == null)
                {
                    return new CostPerCar
                    {
                        NomVoiture = car.NomVoiture,
                        TotalKm = car.TotalKm,
                        TotalPrix = 0.0m,
                        TotalLitres = 0.0m // Si aucune donnée, consommation = 0
                    };
                }

                // Vérifier que km_consommation, prix_consommation et litre_consommation ont des valeurs valides
                if (carData.km_consommation.HasValue && carData.km_consommation.Value != 0 &&
                    carData.prix_consommation.HasValue && carData.litre_consommation.HasValue)
                {
                    // Convertir les valeurs pour les calculs
                    decimal prixConsommation = carData.prix_consommation.Value; // Prix par unité de consommation
                    decimal kmConsommation = carData.km_consommation.Value; // Distance correspondant à une unité de consommation
                    decimal litreConsommation = carData.litre_consommation.Value; // Consommation en litres pour kmConsommation
                    decimal totalKm = (decimal)car.TotalKm; // Total des kilomètres parcourus

                    // Calcul du prix dépensé
                    decimal prix_despense = (totalKm * prixConsommation) / kmConsommation;

                    // Calcul des litres dépensés
                    decimal litres_despenses = (totalKm * litreConsommation) / kmConsommation;

                    return new CostPerCar
                    {
                        NomVoiture = car.NomVoiture,
                        TotalKm = (double)totalKm,
                        TotalPrix = prix_despense,
                        TotalLitres = litres_despenses // save les litres consommés
                    };
                }
                else
                {
                    return new CostPerCar
                    {
                        NomVoiture = car.NomVoiture,
                        TotalKm = car.TotalKm,
                        TotalPrix = 0.0m,
                        TotalLitres = 0.0m // Consommation nulle si données invalides
                    };
                }
            })
            .GroupBy(c => c.NomVoiture)
            .Select(g => new CostPerCar
            {
                NomVoiture = g.Key,
                TotalKm = g.Sum(c => c.TotalKm),
                TotalPrix = g.Sum(c => c.TotalPrix),
                TotalLitres = g.Sum(c => c.TotalLitres)
            })
            .OrderByDescending(c => c.TotalPrix)
            .ToList();

            // Calculer le coût total en additionnant les coûts de chaque voiture
            decimal totalCost = totalCostPerCar.Sum(c => c.TotalPrix);

            return Ok(new
            {
                Period = period,
                TotalCost = totalCost,
                CostPerCar = totalCostPerCar.Select(c => new
                {
                    c.NomVoiture,
                    c.TotalPrix,
                    c.TotalKm,
                    c.TotalLitres // Inclure les litres consommés
                })
            });
        }

        /// <summary>
        /// Classes pour des valeurss de résultats
        /// </summary>
        public class KmData
        {
            public string NomVoiture { get; set; }
            public string DatetimeMatin { get; set; }
            public string DatetimeSoir { get; set; } 
            public string Fin { get; set; }
            public string Depart { get; set; }
        }

        public class TripData
        {
            public string NomVoiture { get; set; }
            public double TotalKmMatin { get; set; }
            public double TotalKmSoir { get; set; }
            public double TotalKm => TotalKmMatin + TotalKmSoir;
        }

        public class CostPerCar
        {
            public string NomVoiture { get; set; }
            public double TotalKm { get; set; }
            public decimal TotalPrix { get; set; }
            public decimal TotalLitres { get; set; }
        }
    }
}
