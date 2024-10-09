using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_usagers;
using package_my_db_context;

using package_axe_usagers_ramassage;
using package_axe_usagers_depot;
using Microsoft.AspNetCore.Identity;

using package_usager_request;


namespace package_usagers_controller
{
    [Route("api/usagers")]
    [ApiController]
    public class Usagers_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Usagers_controller(MyDbContext context)
        {
            _context = context;
        }
    

    //CRUD

    //voir toute la liste avec genre et poste
        [HttpGet("liste")]
    // exemple : http://localhost:5218/api/usagers/liste
        public async Task<ActionResult<IEnumerable<Usagers>>> GetUsagers()
        {
            return await _context.Usagers_instance
                .Include(u => u.Genre)
                .Include(u => u.Poste)
                .Include(u => u.Departement)
                .ToListAsync();
        }


        //usagers par id
        [HttpGet("{id}")]
        // exemple : http://localhost:5218/api/usagers/3
        public async Task<ActionResult<Usagers>> GetUsager(int id)
        {
            var usager = await _context.Usagers_instance
                .Include(u => u.Genre)
                .Include(u => u.Poste)
                .Include(u => u.Departement)
                .FirstOrDefaultAsync(u => u.id == id);

            if (usager == null)
            {
                return NotFound();
            }

            return usager;
        }


        //ajout usagers avec axe de ramassage et depot 
        // exemple de donnée de test
            //         {
            //   "UsagerDto": {
            //     "matricule": "12345",
            //     "nom": "Dupont",
            //     "date_naissance": "1990-01-01",
            //     "contact": "0123456789",
            //     "adresse": "123 Rue Exemple",
            //     "mail_ravinala": "dupont@example.com",
            //     "genre_id": 1,
            //     "poste_id": 2,
            //     "departement_id": 3
            //   },
            //   "Ramassage": {
            //     "lieu": "Place de la République",
            //     "heure_ramassage": "08:00:00",
            //     "axe_id": 1,
            //     "est_actif": true
            //   },
            //   "Depot": {
            //     "lieu": "Gare Centrale",
            //     "heure_depot": "17:00:00",
            //     "axe_id": 2,
            //     "est_actif": false
            //   }
            // }

        [HttpPost("ajout")]
        public async Task<IActionResult> AddUsager([FromBody] UsagerRequest request)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage);
                return BadRequest(new { Errors = errors });
            }

            try
            {
                // Création d'un nouvel usager
                var usager = new Usagers
                {
                    matricule = request.UsagerDto.matricule,
                    nom = request.UsagerDto.nom,
                    date_naissance = request.UsagerDto.date_naissance?.ToUniversalTime(),
                    contact = request.UsagerDto.contact,
                    adresse = request.UsagerDto.adresse,
                    mail_ravinala = request.UsagerDto.mail_ravinala,
                    genre_id = request.UsagerDto.genre_id,
                    poste_id = request.UsagerDto.poste_id,
                    departement_id = request.UsagerDto.departement_id,
                };

                // Ajout de l'usager dans la base de données
                _context.Usagers_instance.Add(usager);
                await _context.SaveChangesAsync();

                // Ajout des informations de ramassage
                if (request.Ramassage != null)
                {
                    var ramassage = new Axe_usagers_ramassage
                    {
                        lieu = request.Ramassage.lieu,
                        heure_ramassage = request.Ramassage.heure_ramassage,
                        axe_id = request.Ramassage.axe_id,
                        usagers_id = usager.id,
                        est_actif = request.Ramassage.est_actif
                    };

                    _context.Axe_usagers_ramassage_instance.Add(ramassage);
                }

                // Ajout des informations de dépôt
                if (request.Depot != null)
                {
                    var depot = new Axe_usagers_depot
                    {
                        lieu = request.Depot.lieu,
                        heure_depot = request.Depot.heure_depot,
                        axe_id = request.Depot.axe_id,
                        usagers_id = usager.id,
                        est_actif = request.Depot.est_actif
                    };

                    _context.Axe_usagers_depot_instance.Add(depot);
                }

                await _context.SaveChangesAsync();

                return Ok("Usager ajouté avec succès !");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erreur du serveur : {ex.Message}");
            }
        }



        //ajout usager , only usagers
        //  [HttpPost("ajout")]
        // // exemple : http://localhost:5218/api/usagers/ajout
        // public async Task<ActionResult<Usagers>> CreateUsager(Usagers usager)
        // {
        //     if (usager.date_naissance.HasValue)
        //     {
        //         // Convertir la date à UTC avant de l'enregistrer
        //         usager.date_naissance = usager.date_naissance.Value.ToUniversalTime();
        //     }

        //     // Vérifier si le matricule existe déjà, en ignorant la casse
        //     bool matriculeExists = await _context.Usagers_instance
        //         .AnyAsync(u => u.matricule.ToLower() == usager.matricule.ToLower());

        //     if (matriculeExists)
        //     {
        //         // Retourner une erreur si le matricule existe déjà
        //         return BadRequest("Le matricule saisi existe déjà.");
        //     }

        //     _context.Usagers_instance.Add(usager);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction("GetUsagers", new { id = usager.id }, usager);
        // }


        //modifié usager
        [HttpPut("{id}")]
        // exemple : http://localhost:5218/api/usagers/3
    //      {
    //     "id":3,
    //     "matricule": "MAT005",
    //     "nom": "Bellock",
    //     "date_naissance": "1995-03-17",
    //     "contact": "034 02 345 68 / 032 45 567 88",
    //     "mail_ravinala": "bellock@ravinala.com",
    //     "genre_id": 1,
    //     "poste_id": 1,
    //     "departement_id":2
    //      }
        public async Task<IActionResult> UpdateUsager(int id, Usagers usager)
        {
            if (id != usager.id)
            {
                return BadRequest("L'ID dans l'URL ne correspond pas à l'ID de l'objet.");
            }

            // Vérifiez si l'usager existe
            var existingUsager = await _context.Usagers_instance.FindAsync(id);
            if (existingUsager == null)
            {
                return NotFound("Usager non trouvé.");
            }

            // Mettez à jour les propriétés de l'usager existant
            existingUsager.matricule = usager.matricule;
            existingUsager.nom = usager.nom;

            // Assurez-vous de convertir la date à UTC si nécessaire
            if (usager.date_naissance.HasValue)
            {
                existingUsager.date_naissance = usager.date_naissance.Value.ToUniversalTime();
            }
            else
            {
                // Si la date est nulle, vous pouvez gérer cela ici si nécessaire
                existingUsager.date_naissance = null; // ou la valeur que vous souhaitez
            }

            existingUsager.contact = usager.contact;
            existingUsager.mail_ravinala = usager.mail_ravinala;
            existingUsager.genre_id = usager.genre_id;
            existingUsager.poste_id = usager.poste_id;
            existingUsager.departement_id = usager.departement_id;


            // Mettez l'état de l'entité à modifié
            _context.Entry(existingUsager).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsagerExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        //supprimer un usager
        [HttpDelete("{id}")]
        // exemple : http://localhost:5218/api/usagers/4
        public async Task<IActionResult> DeleteUsager(int id)
        {
            var usager = await _context.Usagers_instance.FindAsync(id);
            if (usager == null)
            {
                return NotFound();
            }

            _context.Usagers_instance.Remove(usager);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UsagerExists(int id)
        {
            return _context.Usagers_instance.Any(e => e.id == id);
        }

}

}