using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace package_prestataire
{
    public class Prestataire
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int id {get;set;}

        [Column("prestataire")]
        public string? prestataire {get; set;}
        
        [Column("debut_contrat")]
        public DateTime? debut_contrat {get; set;}

        [Column("fin_contrat")]
        public DateTime? fin_contrat {get; set;}

    }
}