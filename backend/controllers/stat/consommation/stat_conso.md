maintenant retournons dans le backend , voici des modèles 
en utilisant ces modèles :
 Cars (nom_car, litre_consommation, km_consommation, prix_consommation)
km_matin_push
km_soir_push

je voudrais que tu me fasses un controller pour avoir les statistiques possibles que je pourrais avoir et trouver pértinent , des statistiques générales et individuelles et par classement de comparaison  avec ordre 


voici les modèles :

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

        [Column("est_actif")]
        public bool est_actif { get; set; }

        [Column("litre_consommation")]
        public decimal? litre_consommation { get; set; }

        [Column("km_consommation")]
        public decimal? km_consommation { get; set; }

        [Column("prix_consommation")]
        public decimal? prix_consommation { get; set; }

        [Column("type_carburant")]
        public string? type_carburant { get; set; }

        

    }

}

=========================
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


        public List<km_matin_push>? KmMatin { get; set; }
        public List<km_soir_push>? KmSoir { get; set; }


    }
}

 