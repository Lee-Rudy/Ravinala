using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using package_type_cars;
using package_prestataire;
using package_cars;

namespace package_cars_request
{
    public class CarsRequest
    {
        public Cars CarsDto {get; set;}

        public Type_cars Type_carsDto {get; set;}

        public Prestataire PrestaitaireDto {get; set;}
    }
}