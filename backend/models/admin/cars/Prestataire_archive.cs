using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;

using package_prestataire;

namespace package_prestataire_archive
{
    public class Prestataire_archive
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

        [Column("prestataire_id")]
        public int? prestataire_id {get; set;}

         [ForeignKey("prestataire_id")]
         public virtual Prestataire? Prestataire { get; set; }

    }
}