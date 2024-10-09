using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Runtime.InteropServices;

using package_prestataire;
using package_type_cars;

namespace package_cars
{
    public class Cars
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("id")]
        public int id {get; set;}

        [Column("nom_car")]
        public string? nom_car{get; set;}

        [Column("immatriculation")]
        public string? immatriculation{get; set;}

        [Column("nombre_place")]
        public int? nombre_place{get; set;}

        //forzign key
        [Column("prestataire_id")]
        public int prestataire_id { get; set; }

        [Column("type_cars_id")]
        public int type_cars_id { get; set; }

         [ForeignKey("prestataire_id")]
        public virtual Prestataire? Prestataire { get; set; }

        [ForeignKey("type_cars_id")]
        public virtual Type_cars? Type_cars { get; set; }

    }

}