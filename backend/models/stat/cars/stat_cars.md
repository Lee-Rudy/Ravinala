bonjour, continuons dans le controller , maintenant faisons le statistiques concernant les cars , en utilisant le remassage, dépôt et imprévus ainsi que le bouton_push fais des  controllers bien séparés pour donnée les résultat suivante :

1-Nombre de retards des cars / taux de ponctualité des cars avant 7h30.:
     - en utilisant le bouton push , je veux un résultat : total nombre de retard pendant l'année entière séléctionné pour toute car confondue seulement le ramassage 
      - nombre total de retard de car pour chaque mois dans l'année séléctionné pour tout cars confondue 
      - nombre total de retard pour un car séléctionné dans une année et détaillée pour chaque mois après avoir séléctionnée le car et l'année 
2-Moyenne de nombre passagers par mois ou année (ramassage et dépôt) dans le car :
je séléctionne une année et le car j'ai le moyenne des passagers en cette année et pour chaque mois en nombre pour ce car 
3-Affichage des cars ayant un taux de passagers élevé (ramassage et dépôt)
je séléctionne une année et j'ai en ordre les cars avec un moyenne le plus élévée pour cette année et en détail pour chaque mois de cette année 

voici les modèles :
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
