using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Runtime.InteropServices;

using package_axe_usagers_ramassage;


namespace package_pointage_usagers_ramassage
{
    public class Pointage_usagers_ramassage
    {   
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("id")]
        public int id {get; set;}

        [Column("date_pointage")]
        public DateTime date_pointage {get; set;}

        [Column("heure_pointage")]
        public TimeSpan heure_pointage {get; set;}

        //bouton départ
         [Column("heure_depart")]
        public TimeSpan heure_depart {get; set;}

        //bouton arrivee
         [Column("heure_arrivee")]
        public TimeSpan heure_arrivee {get; set;}

        [Column("axe_usagers_ramassage_id")]
        public int axe_usagers_ramassage_id {get; set;}

        [ForeignKey("axe_usagers_ramassage_id")]
        public virtual  Axe_usagers_ramassage? Axe_usagers_ramassage{get; set;}


        [Column("kilometrage_debut")]
        public int kilometrage_debut {get; set;}

         [Column("kilometrage_fin")]
        public int kilometrage_fin {get; set;}


    }
}
