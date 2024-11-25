// DTOs.cs
using Newtonsoft.Json;
using System.Collections.Generic;

namespace package_push_frequence.DTOs
{
    public class CarFrequency
    {
        [JsonProperty("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonProperty("count")]
        public int Count { get; set; }

        [JsonProperty("percentage")]
        public double Percentage { get; set; }
    }

    public class MonthlyTopCar
    {
        [JsonProperty("mois")]
        public string Mois { get; set; }

        [JsonProperty("topRamassageVoiture")]
        public string TopRamassageVoiture { get; set; }

        [JsonProperty("topRamassagePercentage")]
        public double TopRamassagePercentage { get; set; }

        [JsonProperty("topDepotVoiture")]
        public string TopDepotVoiture { get; set; }

        [JsonProperty("topDepotPercentage")]
        public double TopDepotPercentage { get; set; }

        [JsonProperty("topImprevuVoiture")]
        public string TopImprevuVoiture { get; set; }

        [JsonProperty("topImprevuPercentage")]
        public double TopImprevuPercentage { get; set; }
    }

    public class ParcoursStatisticsResponse
    {
        [JsonProperty("ramassageFrequency")]
        public List<CarFrequency> RamassageFrequency { get; set; }

        [JsonProperty("depotFrequency")]
        public List<CarFrequency> DepotFrequency { get; set; }

        [JsonProperty("imprevusFrequency")]
        public List<CarFrequency> ImprevusFrequency { get; set; }

        [JsonProperty("monthlyComparison")]
        public List<MonthlyTopCar> MonthlyComparison { get; set; }
    }
}
