using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Runtime.InteropServices;

//   public DbSet<prestataire_contrat> Prestataire_contrat_instance { get; set; }
//         public DbSet<carte_carburants> Carte_carburants_instance { get; set; }

namespace package_facturations
{
    public class prestataire_contrat
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]

        public int id {get;set;}

        [Column("nom_prestataire")]
        public string nom_prestataire { get; set; }

        [Column("contrat_type")]
        public string contrat_type { get; set; }

        [Column("numero_facture")]
        public string numero_facture { get; set; }

        //prendre uniquement la date et non pas l'heure
        [Column("date_emission")]
        public DateTime date_emission { get; set; }

          [Column("designation")]
        public string designation { get; set; }

          [Column("nbr_vehicule")]
        public int nbr_vehicule { get; set; }

          [Column("nbr_jour")]
        public int nbr_jour { get; set; }

          [Column("prix_unitaire")]
        public decimal prix_unitaire { get; set; }

    }

    public class carte_carburants
    {
         [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]

        public int id {get;set;}

          [Column("nom_prestataire")]
        public string nom_prestataire { get; set; }

        [Column("contrat_type")]
        public string contrat_type { get; set; }

        [Column("numero_facture")]
        public string numero_facture { get; set; }

        //prendre uniquement la date et non pas l'heure
        [Column("date_emission")]
        public DateTime date_emission { get; set; }

        [Column("carburants")]
        public decimal carburants { get; set; }

        [Column("import_pdf")]
        public byte[] ImportPdf { get; set; }

    }
}