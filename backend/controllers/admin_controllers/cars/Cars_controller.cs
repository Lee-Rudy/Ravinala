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
        var carsWithDetails = await (from car in _context.Cars_instance
                                     join typeCar in _context.Type_cars_instance
                                     on car.type_cars_id equals typeCar.id
                                     join prestataire in _context.Prestataire_instance
                                     on car.prestataire_id equals prestataire.id
                                     select new
                                     {
                                         id = car.id, // Assurez-vous que l'ID est inclus
                                         nomCar = car.nom_car,
                                         immatriculation = car.immatriculation,
                                         nombrePlace = car.nombre_place,
                                         typeCar = typeCar.type_cars,
                                         prestataire = prestataire.prestataire,
                                         debutContrat = prestataire.debut_contrat,
                                         finContrat = prestataire.fin_contrat,
                                         est_actif = car.est_actif,
                                         litre_consommation = car.litre_consommation,
                                         km_consommation = car.km_consommation,
                                         prix_consommation = car.prix_consommation
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




            // {
            //   "CarsDto": {
            //     "nom_car": "Car1",
            //     "immatriculation": "0228TBH",
            //     "nombre_place": 32,
            //     "litre_consommation": 14,
            //     "km_consommation": 100,
            //     "prix_consommation": 80000,
            //     "type_carburant": "Gasoil"
            //   },
            //   "PrestaitaireDto": {
            //     "id": 1
            //   },
            //   "Type_carsDto": {
            //     "id": 1
            //   }
            // }

            [HttpPost("ajout")]
            public async Task<ActionResult<Cars>> addCars([FromBody] CarsRequest request)
            {
                Console.WriteLine($"Nom car : {request.CarsDto.nom_car}");
                Console.WriteLine($"Prestataire ID : {request.PrestaitaireDto.id}"); //PrestaitaireDto "misy i supplémentaire"
                Console.WriteLine($"Type car ID : {request.Type_carsDto.id}");

                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                                            .SelectMany(v => v.Errors)
                                            .Select(e => e.ErrorMessage);
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
                        type_cars_id = request.Type_carsDto.id,
                    };

                    // Ajouter la voiture dans la base de données
                    _context.Cars_instance.Add(car);
                    await _context.SaveChangesAsync();

                    return Ok("Cars ajouté avec succès !");
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Erreur du serveur: {ex.Message}");
                }
            }



//http://localhost:5218/api/cars/update/9
//             {
//   "CarsDto": {
//     "nom_car": "Car4",
//     "immatriculation": "1234XYZ",
//     "nombre_place": 20,
//     "litre_consommation": 15,
//     "km_consommation": 120,
//     "prix_consommation": 90000,
//     "type_carburant": "Essence"
//   },
//   "PrestaitaireDto": {
//     "id": 2
//   },
//   "Type_carsDto": {
//     "id": 3
//   }
// }


            [HttpPut("update/{id}")]
public async Task<IActionResult> UpdateCars(int id, [FromBody] CarsRequest request)
{
    if (!ModelState.IsValid)
    {
        var errors = ModelState.Values
                                .SelectMany(v => v.Errors)
                                .Select(e => e.ErrorMessage);
        return BadRequest(new { Errors = errors });
    }

    try
    {
        var car = await _context.Cars_instance.FindAsync(id);
        if (car == null)
        {
            return NotFound($"Cars avec l'ID {id} n'a pas été trouvé.");
        }

        // Mettre à jour les propriétés du véhicule
        car.nom_car = request.CarsDto.nom_car;
        car.immatriculation = request.CarsDto.immatriculation;
        car.nombre_place = request.CarsDto.nombre_place;
        car.litre_consommation = request.CarsDto.litre_consommation;
        car.km_consommation = request.CarsDto.km_consommation;
        car.prix_consommation = request.CarsDto.prix_consommation;
        car.type_carburant = request.CarsDto.type_carburant;
        car.est_actif = request.CarsDto.est_actif; // Mise à jour du statut
        car.prestataire_id = request.PrestaitaireDto.id;
        car.type_cars_id = request.Type_carsDto.id;

        // Mettre à jour l'entité dans le contexte
        _context.Cars_instance.Update(car);
        await _context.SaveChangesAsync();

        return Ok("Véhicule mis à jour avec succès !");
    }
    catch (Exception ex)
    {
        return StatusCode(500, $"Erreur du serveur: {ex.Message}");
    }
}



            


        }
        
}
