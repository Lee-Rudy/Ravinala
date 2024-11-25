using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.ModelBinding;


namespace package_login_cars
{
    public class Login_cars
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int Id {get; set;}

        [Column("nom_car_login")]
        public string nom_car_login {get; set;}

        [Column("mot_de_passe")]
        public string mot_de_passe {get; set;}
    }
}