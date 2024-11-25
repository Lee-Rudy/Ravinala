[HttpGet("ranking/totalcost/since")]
        public async Task<IActionResult> GetTotalCostSince(DateTime date)
        {
            string dateStr = date.ToString("yyyy-MM-dd");
            string nextDateStr = date.AddDays(1).ToString("yyyy-MM-dd");

            // Récupérer les trajets matin depuis la date spécifiée
            var kmMatin = GetKmData(
                _context.Km_matin_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeMatin = km.DatetimeMatin,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                dateStr,
                nextDateStr,
                isMatin: true,
                selectedCars: null); // Toutes les voitures

            // Récupérer les trajets soir depuis la date spécifiée
            var kmSoir = GetKmData(
                _context.Km_soir_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeSoir = km.DatetimeSoir,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                dateStr,
                nextDateStr,
                isMatin: false,
                selectedCars: null); // Toutes les voitures

            // Calculer les coûts
            var result = await CalculateTotalCost(kmMatin, kmSoir, dateStr);

            return result;
        }

        /// <summary>
        /// Statistique par mois
        /// </summary>
        [HttpGet("ranking/totalcost/month")]
        public async Task<IActionResult> GetTotalCostByMonth(string month)
        {
            string monthStart = $"{month}-01";
            string nextMonthStart = DateTime.Parse(monthStart).AddMonths(1).ToString("yyyy-MM-dd");

            var kmMatin = GetKmData(
                _context.Km_matin_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeMatin = km.DatetimeMatin,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                monthStart,
                nextMonthStart,
                isMatin: true,
                selectedCars: null); // Toutes les voitures

            var kmSoir = GetKmData(
                _context.Km_soir_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeSoir = km.DatetimeSoir,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                monthStart,
                nextMonthStart,
                isMatin: false,
                selectedCars: null); // Toutes les voitures

            return await CalculateTotalCost(kmMatin, kmSoir, monthStart);
        }

        /// <summary>
        /// Statistique par année
        /// </summary>
        [HttpGet("ranking/totalcost/year")]
        public async Task<IActionResult> GetTotalCostByYear(string year)
        {
            string yearStart = $"{year}-01-01";
            string nextYearStart = DateTime.Parse(yearStart).AddYears(1).ToString("yyyy-MM-dd");

            var kmMatin = GetKmData(
                _context.Km_matin_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeMatin = km.DatetimeMatin,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                yearStart,
                nextYearStart,
                isMatin: true,
                selectedCars: null); // Toutes les voitures

            var kmSoir = GetKmData(
                _context.Km_soir_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeSoir = km.DatetimeSoir,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                yearStart,
                nextYearStart,
                isMatin: false,
                selectedCars: null); // Toutes les voitures

            return await CalculateTotalCost(kmMatin, kmSoir, yearStart);
        }

        /// <summary>
        /// Statistique pour une voiture spécifique par année
        /// </summary>
        [HttpGet("ranking/totalcost/car/year")]
        public async Task<IActionResult> GetTotalCostForCarByYear(string carName, string year)
        {
            string yearStart = $"{year}-01-01";
            string nextYearStart = DateTime.Parse(yearStart).AddYears(1).ToString("yyyy-MM-dd");

            var kmMatin = GetKmData(
                _context.Km_matin_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeMatin = km.DatetimeMatin,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                yearStart,
                nextYearStart,
                isMatin: true,
                selectedCars: new List<string> { carName.ToLower() }); // Voiture spécifique

            var kmSoir = GetKmData(
                _context.Km_soir_push_instance.Select(km => new KmData
                {
                    NomVoiture = km.NomVoiture,
                    DatetimeSoir = km.DatetimeSoir,
                    Fin = km.Fin,
                    Depart = km.Depart
                }),
                yearStart,
                nextYearStart,
                isMatin: false,
                selectedCars: new List<string> { carName.ToLower() }); // Voiture spécifique

            return await CalculateTotalCost(kmMatin, kmSoir, $"{carName}-{year}");
        }