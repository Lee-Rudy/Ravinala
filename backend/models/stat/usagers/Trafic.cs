// DTOs/UsagerMonthlyStatDTO.cs
using Newtonsoft.Json;

namespace package_push_controller.DTOs
{
    public class UsagerMonthlyStatDTO
    {
        [JsonProperty("mois")]
        public int Mois { get; set; }

        [JsonProperty("annee")]
        public int Annee { get; set; }

        [JsonProperty("ramassage_present")]
        public int RamassagePresent { get; set; }

        [JsonProperty("ramassage_imprevu")]
        public int RamassageImprevu { get; set; }

        [JsonProperty("ramassage_total")]
        public int RamassageTotal => RamassagePresent + RamassageImprevu;

        [JsonProperty("depot_present")]
        public int DepotPresent { get; set; }

        [JsonProperty("depot_imprevu")]
        public int DepotImprevu { get; set; }

        [JsonProperty("depot_total")]
        public int DepotTotal => DepotPresent + DepotImprevu;
    }
}
