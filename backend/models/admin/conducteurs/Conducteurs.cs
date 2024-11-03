using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Runtime.InteropServices;

namespace package_conducteurs
{
    public class Conducteurs
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("id")]
        public int id {get; set;}

        [Column("nom")]
        public string? nom{get; set;}

        [Column("date_naissance")]
        public DateTime? date_naissance{get; set;}

        [Column("adresse")]
        public string? adresse{get; set;}

        //forzign key
        [Column("contact")]
        public string? contact { get; set; }

        [Column("mail")]
        public string? mail { get; set; }

        [Column("est_actif")]
        public bool est_actif { get; set; }

    }

}
