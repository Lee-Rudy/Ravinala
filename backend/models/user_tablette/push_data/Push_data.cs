using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using package_cars;
using package_conducteurs;
using package_axe;

namespace package_push_data
{
    public class Pointage_ramassage_push
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
         [BindNever]

        public int Id { get; set; }

        [Column("matricule")]
        public string Matricule { get; set; }

        [Column("nomUsager")]
        public string NomUsager { get; set; }

        [Column("nomVoiture")]
        public string NomVoiture { get; set; }

        [Column("datetime_ramassage")]
        public string DatetimeRamassage { get; set; }

        [Column("est_present")]
        public string EstPresent { get; set; }

        [JsonIgnore]
        [Column("recu_le")]
        public DateTime RecuLe { get; set; } = DateTime.Now;

    }


    public class Pointage_depot_push
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
         [BindNever]

        public int Id { get; set; }

        [Column("matricule")]
        public string Matricule { get; set; }

        [Column("nomUsager")]
        public string NomUsager { get; set; }

        [Column("nomVoiture")]
        public string NomVoiture { get; set; }

        [Column("datetime_depot")]
        public string DatetimeDepot { get; set; }

        [Column("est_present")]
        public string EstPresent { get; set; }

        [JsonIgnore]
        [Column("recu_le")]
        public DateTime RecuLe { get; set; } = DateTime.Now;

    }

    public class Btn_push
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
         [BindNever]

        public int Id { get; set; }

        [Column("datetime_depart")]
        public string DatetimeDepart { get; set; }

        [Column("datetime_arrivee")]
        public string DatetimeArrivee { get; set; }

        [Column("nomVoiture")]
        public string NomVoiture { get; set; }

        [Column("recu_le")]
        public DateTime RecuLe { get; set; } = DateTime.Now;

    }

    [Table("pointage_usagers_imprevu_push")]
    public class Pointage_usagers_imprevu_push
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
         [BindNever]
        public int Id { get; set; }

        [Column("matricule")]
        public string Matricule { get; set; }

        [Column("datetime_imprevu")]
        public string DatetimeImprevu { get; set; }

        [Column("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonIgnore]
        [Column("recu_le")]
        public DateTime RecuLe { get; set; } = DateTime.Now;

    }



    [Table("km_matin_push")]
    public class km_matin_push
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
         [BindNever]
        public int Id { get; set; }

        [Column("depart")]
        public string Depart { get; set; }

        [Column("fin")]
        public string Fin{ get; set; }

        [Column("datetime_matin")]
        public string DatetimeMatin{ get; set; }

        [Column("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonIgnore]
        [Column("recu_le")]
        public DateTime RecuLe { get; set; } = DateTime.Now;
    }

    [Table("km_soir_push")]
    public class km_soir_push
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
         [BindNever]
        public int Id { get; set; }

        [Column("depart")]
        public string Depart { get; set; }

        [Column("fin")]
        public string Fin{ get; set; }

        [Column("datetime_soir")]
        public string DatetimeSoir{ get; set; }

        [Column("nomVoiture")]
        public string NomVoiture { get; set; }

        [JsonIgnore]
        [Column("recu_le")]
        public DateTime RecuLe { get; set; } = DateTime.Now;
    }





//=============================================
    public class PushDataRequest
    {
        public List<Pointage_ramassage_push>? PointageRamassage { get; set; }
        public List<Pointage_depot_push>? PointageDepot { get; set; }
        public List<Btn_push>? Btn { get; set; }
        public List<Pointage_usagers_imprevu_push>? PointageUsagersImprevu { get; set; }

        public List<km_matin_push>? KmMatin { get; set; }
        public List<km_soir_push>? KmSoir { get; set; }


    }
}
