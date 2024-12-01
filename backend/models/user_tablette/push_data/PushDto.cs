// DTOs/PushDataRequestDTO.cs
using System.Collections.Generic;
using Newtonsoft.Json;

namespace package_push_controller.DTOs
{
    public class PushDataRequestDTO
    {
        [JsonProperty("PointageRamassage")]
        public List<PointageRamassageDTO>? PointageRamassage { get; set; }

        [JsonProperty("PointageDepot")]
        public List<PointageDepotDTO>? PointageDepot { get; set; }

        [JsonProperty("Btn")]
        public List<BoutonDTO>? Btn { get; set; }

        [JsonProperty("PointageUsagersImprevu")]
        public List<PointageImprevuDTO>? PointageUsagersImprevu { get; set; }

        [JsonProperty("KMMATIN")]
        public List<KmMatinDTO>? KmMatin { get; set; }

        [JsonProperty("KMSOIR")]
        public List<KmSoirDTO>? KmSoir { get; set; }
    }

    public class PointageRamassageDTO
    {
        [JsonProperty("matricule")]
        public string Matricule { get; set; }

        [JsonProperty("nomUsager")]
        public string NomUsager { get; set; }

        [JsonProperty("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonProperty("datetime_ramassage")]
        public string? DatetimeRamassage { get; set; }

        [JsonProperty("est_present")]
        public string EstPresent { get; set; }  // Changer en bool pour correspondre aux données JSON
    }


    public class PointageDepotDTO
    {
        [JsonProperty("matricule")]
        public string Matricule { get; set; }

        [JsonProperty("nomUsager")]
        public string NomUsager { get; set; }

        [JsonProperty("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonProperty("datetime_depot")]
        public string? DatetimeDepot { get; set; }

        [JsonProperty("est_present")]
        public string EstPresent { get; set; }  // Changer en bool pour correspondre aux données JSON
    }

    public class BoutonDTO
    {
        [JsonProperty("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonProperty("datetime_depart")]
        public string? DatetimeDepart { get; set; } // Date en String peut être null

        [JsonProperty("datetime_arrivee")]
        public string? DatetimeArrivee { get; set; } // Date en String peut être null
    }

    public class PointageImprevuDTO
    {
        [JsonProperty("matricule")]
        public string Matricule { get; set; }

        [JsonProperty("nom")]
        public string nom { get; set; }

        [JsonProperty("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonProperty("datetime_imprevu")]
        public string? DatetimeImprevu { get; set; } // Date en String
    }

     public class KmMatinDTO
    {
        [JsonProperty("depart")]
        public string Depart { get; set; }

        [JsonProperty("fin")]
        public string Fin { get; set; }

        [JsonProperty("datetime_matin")]
        public string DatetimeMatin { get; set; }

        [JsonProperty("nomVoiture")]
        public string? NomVoiture { get; set; } // Date en String
    }

    public class KmSoirDTO
    {
        [JsonProperty("depart")]
        public string Depart { get; set; }

        [JsonProperty("fin")]
        public string Fin { get; set; }

         [JsonProperty("datetime_soir")]
        public string DatetimeSoir { get; set; }

        [JsonProperty("nomVoiture")]
        public string? NomVoiture { get; set; } // Date en String
    }
}
