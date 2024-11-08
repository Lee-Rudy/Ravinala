using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_prestataire;
using package_type_cars;
using package_my_db_context;
using package_cars;
using package_cars_request;

namespace package_cars_controller
{
        [Route("api/cars")]
        [ApiController]

        public class Cars_controller : ControllerBase
        {
            private readonly MyDbContext _context;

            public Cars_controller(MyDbContext context)
            {
                _context = context;
            }

            //get list cars
            [HttpGet("liste")]
            public async Task<ActionResult<IEnumerable<Cars>>> GetCars()
            {
                return await _context.Cars_instance.ToListAsync();
            }

            [HttpGet("liste_type_cars_prestataire")]
            public async Task<ActionResult> GetCarsTypecarsPrestataire()
            {
                try
                {
                    // Combine Cars, TypeCars, and Prestataire using joins
                    var carsWithDetails = await (from car in _context.Cars_instance
                                                join typeCar in _context.Type_cars_instance
                                                on car.type_cars_id equals typeCar.id
                                                join prestataire in _context.Prestataire_instance
                                                on car.prestataire_id equals prestataire.id
                                                select new
                                                {
                                                    nomCar = car.nom_car,
                                                    immatriculation = car.immatriculation,
                                                    nombrePlace = car.nombre_place,
                                                    typeCar = typeCar.type_cars,
                                                    prestataire = prestataire.prestataire,
                                                    debutContrat = prestataire.debut_contrat,
                                                    finContrat = prestataire.fin_contrat
                                                }).ToListAsync();

                    return Ok(carsWithDetails);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Erreur serveur: {ex.Message}");
                }
            }


            //add cars

            //modele test
            //  {
            // "CarsDto": {
            //     "nom_car": "Cars 5",
            //     "immatriculation": "022024TBH",
            //     "nombre_place": 16
            // },
            // "Type_carsDto": {
            //     "id": 1
            // },
            // "PrestaitaireDto": {
            //     "id": 2
            // }
            // }

            [HttpPost ("ajout")]
            public async Task<ActionResult<Cars>> addCars([FromBody] CarsRequest request)
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(ValidateAntiForgeryTokenAttribute => ValidateAntiForgeryTokenAttribute.Errors).Select(errors => errors.ErrorMessage);

                    return BadRequest(new { Errors = errors });
                }

                try
                {
                    var car = new Cars
                    {
                        nom_car = request.CarsDto.nom_car,
                        immatriculation = request.CarsDto.immatriculation,
                        nombre_place = request.CarsDto.nombre_place,
                        litre_consommation = request.CarsDto.litre_consommation,
                        km_consommation = request.CarsDto.km_consommation,
                        prix_consommation = request.CarsDto.prix_consommation,
                        type_carburant = request.CarsDto.type_carburant,
                        prestataire_id = request.PrestaitaireDto.id,
                        type_cars_id = request.Type_carsDto.id
                    };

                    // Adding car
                    _context.Cars_instance.Add(car);

                    await _context.SaveChangesAsync();

                    return Ok("Cars ajouté avec succès !");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Erreur du serveur: {ex.Message}");
                }
            }

        }


    }
