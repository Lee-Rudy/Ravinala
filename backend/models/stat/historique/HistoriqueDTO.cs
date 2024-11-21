// DTOs/PointageImprevuResponseDTO.cs
using System;

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
        public string NomVoiture { get; set; }
        public DateTime DateImprevu { get; set; }
        public TimeSpan HeureImprevu { get; set; }
        public DateTime RecuLeDate { get; set; }
        public TimeSpan RecuLeTime { get; set; }
    }
}
