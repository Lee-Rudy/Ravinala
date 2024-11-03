using package_cars;
using package_conducteurs;
using package_axe;

namespace package_axe_conducteurs_request
{
    public class Axe_conducteursRequest
    {
        public Axe AxeDto {get; set;}

        public Conducteurs ConducteursDto{get; set;}

        public Cars CarsDto{get; set;}
    }

}