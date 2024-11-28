// DTOs/ComptageDTO.cs
using System;
using System.Collections.Generic;

namespace package_historique.DTOs
{
    public class ComptageDetailDTO
    {
        public DateTime Date { get; set; }
        public string Jour { get; set; }
        public string RamassageStatut { get; set; } // "Présent" ou "Absent"
        public string DepotStatut { get; set; }     // "Présent" ou "Absent"
    }

    public class ComptageResultDTO
    {
        public string Matricule { get; set; }
        public List<ComptageDetailDTO> Details { get; set; }
        public int TotalRamassagePresent { get; set; }
        public int TotalDepotPresent { get; set; }
        public int TotalPresences { get; set; }
    }
}
