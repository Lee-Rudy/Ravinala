// DTOs/PointageImprevuResponseDTO.cs
using System;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization;

namespace package_historique
{


    public class PointageRamassageResponseDTO
    {
        public int Id { get; set; }
        public string Matricule { get; set; }
        public string NomUsager { get; set; }
        public string NomVoiture { get; set; }
        public DateTime DateRamassage { get; set; }
        public TimeSpan HeureRamassage { get; set; }
        public bool EstPresent { get; set; }
        public DateTime RecuLeDate { get; set; }
        public TimeSpan RecuLeTime { get; set; }
    }
      public class PointageDepotResponseDTO
    {
        public int Id { get; set; }
        public string Matricule { get; set; }
        public string NomUsager { get; set; }
        public string NomVoiture { get; set; }
        public DateTime DateDepot { get; set; }
        public TimeSpan HeureDepot { get; set; }
        public bool EstPresent { get; set; }
        public DateTime RecuLeDate { get; set; }
        public TimeSpan RecuLeTime { get; set; }
    }




public class PointageImprevuResponseDTO
{
    public int Id { get; set; }
    public string Matricule { get; set; }
    public string nom { get; set; }
    public string NomVoiture { get; set; }
    public DateTime DateImprevu { get; set; }
    [JsonPropertyName("heureImprevu")]
    public string HeureImprevu { get; set; }
    public DateTime RecuLeDate { get; set; }
    public TimeSpan RecuLeTime { get; set; }
    public string TypeImprevu { get; set; }
}

// public class PointageImprevuResponseDTO
//     {
//         public int Id { get; set; }
//         public string Matricule { get; set; }
//         public string nom { get; set; }
//         public string NomVoiture { get; set; }
//         public DateTime DateImprevu { get; set; }
//         public TimeSpan HeureImprevu { get; set; }
//         public DateTime RecuLeDate { get; set; }
//         public TimeSpan RecuLeTime { get; set; }
//     }


    //historique des cars 
    public class BtnResponseDTO
    {
        public int Id {get;set;}
        public DateTime DatetimeDepart {get;set;}

        public TimeSpan HeureDepart { get; set; }


        public DateTime DatetimeArrivee {get;set;}

        public TimeSpan HeureArrivee { get; set; }

        public string NomVoiture {get;set;}

        public string? motif {get; set;}

        public DateTime RecuLeDate { get; set; }


        public TimeSpan RecuLeTime { get; set; }
    }

    public class KmMatinResponseDTO 
    {
        public int Id {get;set;}

        public string Depart {get;set;}

        public string Fin {get;set;}

        public DateTime DatetimeMatin {get; set;}

        public TimeSpan HeureMatin { get; set; }


        public string NomVoiture {get;set;}

        public DateTime RecuLeDate { get; set; }


        public TimeSpan RecuLeTime { get; set; }
    }

     public class KmSoirResponseDTO 
    {
        public int Id {get;set;}

        public string Depart {get;set;}

        public string Fin {get;set;}

        public DateTime DatetimeSoir {get; set;}

        public TimeSpan HeureSoir { get; set; }

        public string NomVoiture {get;set;}

        public DateTime RecuLeDate { get; set; }


        public TimeSpan RecuLeTime { get; set; }
    }
}
