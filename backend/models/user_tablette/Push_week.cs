using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Runtime.InteropServices;

using package_pointage_usagers_ramassage;
using package_pointage_usagers_depot;


namespace package_push_week
{
    public class Push_week
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("id")]
        public int id {get; set;}

        [Column("date_push")]
        public DateTime date_push {get; set;}

        [Column("heure_push")]
        public TimeSpan heure_push {get; set;}

        [Column("pointage_usagers_ramassage_id")]
        public int pointage_usagers_ramassage_id {get; set;}

        [Column("pointage_usagers_depot_id")]
        public int pointage_usagers_depot_id {get; set;}

        [ForeignKey("pointage_usagers_ramassage_id")]
        public virtual Pointage_usagers_ramassage? Pointage_usagers_ramassage {get; set;}

        [ForeignKey("pointage_usagers_depot_id")]
        public virtual Pointage_usagers_depot? Pointage_usagers_depot {get; set;}
    }
}
