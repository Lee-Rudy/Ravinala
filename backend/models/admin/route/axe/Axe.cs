using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace package_axe
{
    public class Axe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]

        public int id {get;set;}

        [Column("axe")]
        public string? axe {get; set;}

        [Column("duree_trajet")]
        //en minutes ex : 180 minutes
        public int duree_trajet {get; set;}

        [Column("distance_km")]
        public decimal distance_km {get; set;}

    }
}


