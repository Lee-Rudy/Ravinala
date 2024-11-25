maintenanant voici le controller actuel avec notre consommation par jour , 

maintenant je voudrais que tu ma fasses les controller suivants en se basant sur ce controller :
dans ce controller on peut consulter les statistiques par jours pour chaque car 

- maintenant je veux un statistique par mois , j'entre le mois j'obitens leur statistique de ce mois dans l'ordre comme dans le jour : totalPrix, totalKm, totalLitres, et le totalCost pour chaque car

- de même pour l'année , j'entre une année et j'aurai le statistiques total de tout les mois pour chaque car dans l'ordre : totalPrix, totalKm, totalLitres, et le totalCost pour chaque car 

- et enfin un controller pour le stat individuelle dont j'entre le nom du car et une année et j'obtiens son totalPrix, totalKm, totalLitres, et le totalCost pour de tout les mois 

et voici mon controller que tu vas continuer avec ça :
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using package_cars;
using package_push_data;
using package_my_db_context;
using Newtonsoft.Json;

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

        

//=============================================
        /// <summary>
        /// Statistique 3.2 : Affiche le total du prix de consommation depuis une date spécifiée.
        /// URL : /api/stat/cars/ranking/totalcost/since?date=2024-05-15
        /// </summary>
        [HttpGet("ranking/totalcost/since")]
        public async Task<IActionResult> GetTotalCostSince(DateTime date)
        {
            string dateStr = date.ToString("yyyy-MM-dd");
            string nextDateStr = date.AddDays(1).ToString("yyyy-MM-dd");

            // Récupérer les trips matin depuis la date spécifiée
            var kmMatin = _context.Km_matin_push_instance
                .Where(km => km.NomVoiture != null &&
                            km.DatetimeMatin.Length >= 10 &&
                            string.Compare(km.DatetimeMatin, dateStr) >= 0 &&
                            string.Compare(km.DatetimeMatin, nextDateStr) < 0) // Limite à la plage de date
                .AsEnumerable() // Charge les données en mémoire pour effectuer des opérations non traduisibles en SQL
                .Select(km => new
                {
                    NomVoiture = km.NomVoiture.ToLower(),
                    Distance = (double.TryParse(km.Fin, out double finKm) && double.TryParse(km.Depart, out double departKm))
                        ? finKm - departKm
                        : 0.0
                })
                .GroupBy(km => km.NomVoiture)
                .Select(g => new
                {
                    NomVoiture = g.Key,
                    TotalKmMatin = g.Sum(km => km.Distance)
                })
                .ToList();

            // Log pour vérifier le contenu de kmMatin
            Console.WriteLine("kmMatin:");
            Console.WriteLine(JsonConvert.SerializeObject(kmMatin));

            var kmSoir = _context.Km_soir_push_instance
                .Where(km => km.NomVoiture != null &&
                            km.DatetimeSoir.Length >= 10 &&
                            string.Compare(km.DatetimeSoir, dateStr) >= 0 &&
                            string.Compare(km.DatetimeSoir, nextDateStr) < 0) // Limite à la plage de date
                .AsEnumerable() // Charge les données en mémoire pour effectuer des opérations non traduisibles en SQL
                .Select(km => new
                {
                    NomVoiture = km.NomVoiture.ToLower(),
                    Distance = (double.TryParse(km.Fin, out double finKm) && double.TryParse(km.Depart, out double departKm))
                        ? finKm - departKm
                        : 0.0
                })
                .GroupBy(km => km.NomVoiture)
                .Select(g => new
                {
                    NomVoiture = g.Key,
                    TotalKmSoir = g.Sum(km => km.Distance)
                })
                .ToList();

            // Log pour vérifier le contenu de kmSoir
            Console.WriteLine("kmSoir:");
            Console.WriteLine(JsonConvert.SerializeObject(kmSoir));

            // Charger les données des voitures en mémoire
            var cars = await _context.Cars_instance.ToListAsync();

            // Combiner les trips matin et soir par voiture
            var combinedTrips = kmMatin.GroupJoin(
                kmSoir,
                matin => matin.NomVoiture,
                soir => soir.NomVoiture,
                (matin, soirs) => new
                {
                    NomVoiture = matin.NomVoiture,
                    TotalKmMatin = matin.TotalKmMatin,
                    TotalKmSoir = soirs.FirstOrDefault()?.TotalKmSoir ?? 0.0,
                    TotalKm = matin.TotalKmMatin + (soirs.FirstOrDefault()?.TotalKmSoir ?? 0.0)
                })
                .ToList();

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
                        TotalKm = car.TotalKm,
                        TotalPrix = prix_despense,
                        TotalLitres = litres_despenses // Stocker les litres consommés
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
            .OrderByDescending(c => c.TotalPrix)
            .ToList();

            // Calculer le coût total en additionnant les coûts de chaque voiture
            decimal totalCost = totalCostPerCar.Sum(c => c.TotalPrix);

            return Ok(new
            {
                SinceDate = dateStr,
                TotalCost = totalCost,
                CostPerCar = totalCostPerCar.Select(c => new
                {
                    c.NomVoiture,
                    c.TotalPrix,
                    c.TotalKm,
                    c.TotalLitres // Inclure les litres consommés dans la réponse
                })
            });
        }

        /// <summary>
        /// Classe pour représenter le coût par voiture
        /// </summary>
        public class CostPerCar
        {
            public string NomVoiture { get; set; }
            public double TotalKm { get; set; }
            public decimal TotalPrix { get; set; }
            public decimal TotalLitres { get; set; } 
        }

    }
}

