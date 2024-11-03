using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Runtime.InteropServices;

using package_usagers;
using package_axe;

namespace package_axe_usagers_ramassage
{
    public class Axe_usagers_ramassage
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("id")]
        public int id {get; set;}

        [Column("lieu")]
        public string? lieu {get; set;}

        [Column("heure_ramassage")]
        public TimeSpan? heure_ramassage {get; set;}

        [Column("est_actif")]
        public bool est_actif { get; set; }

        [Column("usagers_id")]
        public int? usagers_id {get; set;}

        [Column("axe_id")]
        public int? axe_id {get; set;}

        [Column("district")]
        public string? district{get;set;}

        [Column("fokontany")]
        public string? fokontany{get;set;}

        //=======================================

        [ForeignKey("usagers_id")]
         public virtual Usagers? Usagers { get; set; }

         [ForeignKey("axe_id")]
         public virtual Axe? Axe { get; set; }
    }
}