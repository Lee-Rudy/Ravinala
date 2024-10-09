using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using package_cars;
using package_conducteurs;
using package_axe;

namespace package_axe_conducteurs
{
    public class Axe_conducteurs
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]

        public int id {get;set;}

        [Column("axe_id")]
        public int? axe_id {get; set;}


        [Column("conducteurs_id")]
        public int? conducteurs_id {get; set;}

        [Column("cars_id")]
        public int? cars_id {get; set;}

        //=====================

        [ForeignKey("axe_id")]
        public virtual Axe? Axe { get; set; }

         [ForeignKey("conducteurs_id")]
        public virtual Conducteurs? Conducteurs { get; set; }

        [ForeignKey("cars_id")]
        public virtual Cars? Cars { get; set; }

    }

}