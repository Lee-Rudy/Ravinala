//==============================================================================
//eto zao no manomboka, encore fails , mbola diso ny résultat 
        /// <summary>
        /// Obtient la moyenne de passagers pour toutes les cars sur une année donnée.
        /// Exemple d'URL : /api/stat/passengers/averagebyyear?year=2024
        /// </summary>
        [HttpGet("cars/passengers/averagebyyear")]
        public async Task<IActionResult> GetAveragePassengersByYear(int year)
        {
            string yearStr = year.ToString();

            // Calculer les passagers uniques (matricule) par car pour les ramassages
            var ramassageGrouped = await _context.PointageRamassagePushes_instance
                .Where(pr =>
                    pr.DatetimeRamassage.StartsWith(yearStr) &&
                    pr.EstPresent == "1")
                .GroupBy(pr => new { pr.NomVoiture, pr.Matricule }) // Groupement par voiture et matricule
                .Select(g => g.Key.NomVoiture) // Sélection des voitures uniques
                .GroupBy(car => car) // Regroupement final par voiture
                .Select(g => new
                {
                    Car = g.Key,
                    PassengersRamassage = g.Count() // Comptage des matricules uniques par voiture
                })
                .ToListAsync();

            // Calculer les passagers uniques (matricule) par car pour les dépôts
            var depotGrouped = await _context.PointageDepotPushes_instance
                .Where(pd =>
                    pd.DatetimeDepot.StartsWith(yearStr) &&
                    pd.EstPresent == "1")
                .GroupBy(pd => new { pd.NomVoiture, pd.Matricule }) // Groupement par voiture et matricule
                .Select(g => g.Key.NomVoiture) // Sélection des voitures uniques
                .GroupBy(car => car) // Regroupement final par voiture
                .Select(g => new
                {
                    Car = g.Key,
                    PassengersDepot = g.Count() // Comptage des matricules uniques par voiture
                })
                .ToListAsync();

            // Fusionner les données des ramassages et des dépôts
            var combined = ramassageGrouped.GroupJoin(
                depotGrouped,
                r => r.Car,
                d => d.Car,
                (r, d) => new
                {
                    Car = r.Car,
                    TotalPassengers = r.PassengersRamassage + d.Sum(x => x.PassengersDepot)
                })
                .ToList();

            // Calculer la moyenne des passagers par voiture
            var averagePassengers = combined
                .Select(c => new
                {
                    Car = c.Car,
                    AveragePassengers = c.TotalPassengers / 12.0 // Diviser par 12 mois
                })
                .OrderByDescending(c => c.AveragePassengers) // Trier par moyenne décroissante
                .ToList();

            return Ok(new { Year = year, AveragePassengersByCar = averagePassengers });
        }


        // ===============================
        // 3. Affichage des cars avec un taux de passagers élevé
        // ===============================

        /// <summary>
        /// Obtient les cars avec les moyennes de passagers les plus élevées pour une année donnée, avec détail par mois.
        /// Exemple d'URL : /api/stat/highpassengercars/tophighpassengercars?year=2024&top=5
        /// </summary>
        [HttpGet("highpassengercars/tophighpassengercars")]
        public async Task<IActionResult> GetTopHighPassengerCars(int year, int top = 10)
        {
            string yearStr = year.ToString();

            // Calculer le nombre total de passagers (ramassage et dépôt) par car
            var ramassageGrouped = await _context.PointageRamassagePushes_instance
                .Where(pr =>
                    pr.DatetimeRamassage.Length >= 19 &&
                    pr.DatetimeRamassage.Substring(0, 4) == yearStr &&
                    pr.EstPresent.Equals("1", StringComparison.OrdinalIgnoreCase))
                .GroupBy(pr => pr.NomVoiture)
                .Select(g => new
                {
                    Car = g.Key,
                    PassengersRamassage = g.Count()
                })
                .ToListAsync();

            var depotGrouped = await _context.PointageDepotPushes_instance
                .Where(pd =>
                    pd.DatetimeDepot.Length >= 19 &&
                    pd.DatetimeDepot.Substring(0, 4) == yearStr &&
                    pd.EstPresent.Equals("1", StringComparison.OrdinalIgnoreCase))
                .GroupBy(pd => pd.NomVoiture)
                .Select(g => new
                {
                    Car = g.Key,
                    PassengersDepot = g.Count()
                })
                .ToListAsync();

            var combined = ramassageGrouped.GroupJoin(
                depotGrouped,
                r => r.Car,
                d => d.Car,
                (r, d) => new
                {
                    Car = r.Car,
                    TotalPassengers = r.PassengersRamassage + d.Sum(x => x.PassengersDepot)
                })
                .ToList();

            // Calculer la moyenne de passagers par car
            var passengerAverages = combined
                .Select(c => new
                {
                    Car = c.Car,
                    AveragePassengers = c.TotalPassengers / 12.0
                })
                .OrderByDescending(c => c.AveragePassengers)
                .Take(top)
                .ToList();

            // Détail par mois pour chaque car
            var detailedAverages = new List<object>();
            foreach (var car in passengerAverages)
            {
                // Ramassage par mois
                var passengersByMonthRamassage = await _context.PointageRamassagePushes_instance
                    .Where(pr =>
                        pr.NomVoiture.Equals(car.Car, StringComparison.OrdinalIgnoreCase) &&
                        pr.DatetimeRamassage.Length >= 19 &&
                        pr.DatetimeRamassage.Substring(0, 4) == yearStr &&
                        pr.EstPresent.Equals("1", StringComparison.OrdinalIgnoreCase))
                    .GroupBy(pr => pr.DatetimeRamassage.Substring(5, 2)) // Extraire le mois
                    .Select(g => new { Month = int.Parse(g.Key), Passengers = g.Count() })
                    .ToListAsync();

                // Dépôt par mois
                var passengersByMonthDepot = await _context.PointageDepotPushes_instance
                    .Where(pd =>
                        pd.NomVoiture.Equals(car.Car, StringComparison.OrdinalIgnoreCase) &&
                        pd.DatetimeDepot.Length >= 19 &&
                        pd.DatetimeDepot.Substring(0, 4) == yearStr &&
                        pd.EstPresent.Equals("1", StringComparison.OrdinalIgnoreCase))
                    .GroupBy(pd => pd.DatetimeDepot.Substring(5, 2)) // Extraire le mois
                    .Select(g => new { Month = int.Parse(g.Key), Passengers = g.Count() })
                    .ToListAsync();

                // Combiner les passagers par mois pour ramassage et dépôt
                var passengersByMonth = new List<object>();
                for (int month = 1; month <= 12; month++)
                {
                    var ramassage = passengersByMonthRamassage.FirstOrDefault(p => p.Month == month)?.Passengers ?? 0;
                    var depot = passengersByMonthDepot.FirstOrDefault(p => p.Month == month)?.Passengers ?? 0;
                    passengersByMonth.Add(new { Month = month, Passengers = ramassage + depot });
                }

                detailedAverages.Add(new
                {
                    car.Car,
                    car.AveragePassengers,
                    PassengersByMonth = passengersByMonth
                });
            }

            return Ok(new
            {
                Year = year,
                TopHighPassengerCars = detailedAverages
            });
        }

        // ===============================
        // Aucune méthode Utilitaire
        // ===============================