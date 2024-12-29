using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.Collections.Generic;
using System.Threading.Tasks;

using package_usagers;
using package_my_db_context;

using package_axe_usagers_ramassage;
using package_axe_usagers_depot;
using Microsoft.AspNetCore.Identity;
using package_poste;
using package_departement;
using package_genre;

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


        [HttpGet("liste_usagers_ramassage_depot")]
        public async Task<ActionResult> GetAxeUsagersRamassageDepot()
        {
            var ramassageDepotList = await _context.Axe_usagers_ramassage_instance
                .Join(
                    _context.Axe_usagers_depot_instance,
                    ramassage => ramassage.usagers_id,
                    depot => depot.usagers_id,
                    (ramassage, depot) => new { 
                        UsagerId = ramassage.Usagers.id,
                        Matricule = ramassage.Usagers.matricule,
                        Nom = ramassage.Usagers.nom,
                        Prenom = ramassage.Usagers.prenom,
                        mail_ravinala = ramassage.Usagers.mail_ravinala,
                        adresse = ramassage.Usagers.adresse,
                        contact = ramassage.Usagers.contact,
                        poste = ramassage.Usagers.Poste.poste,
                        genre = ramassage.Usagers.Genre.genre,
                        departement = ramassage.Usagers.Departement.departement,
                        
                        // Informations de ramassage
                        LieuRamassage = ramassage.lieu,
                        HeureRamassage = ramassage.heure_ramassage,
                        AxeIdRamassage = ramassage.Axe.id,
                        AxeRamassage = ramassage.Axe.axe,
                        DistrictRamassage = ramassage.district, 
                        FokontanyRamassage = ramassage.fokontany, 
                        EstActifRamassage = ramassage.est_actif ,

                        // Informations de dépôt
                        LieuDepot = depot.lieu,
                        HeureDepot = depot.heure_depot,
                        AxeIdDepot = depot.Axe.id,
                        AxeDepot = depot.Axe.axe,
                        DistrictDepot = depot.district, 
                        FokontanyDepot = depot.fokontany, 
                        EstActifDepot = depot.est_actif 
                        
                    }
                )
                .Distinct()
                .ToListAsync();

            return Ok(ramassageDepotList);
        }

        [HttpGet("liste_usagers_ramassage_depot/{id}")]
        public async Task<ActionResult> GetAxeUsagersRamassageDepot_id(int id)
        {
            var ramassageDepot = await _context.Axe_usagers_ramassage_instance
                .Where(ramassage => ramassage.Usagers.id == id)
                .Join(
                    _context.Axe_usagers_depot_instance, 
                    ramassage => ramassage.usagers_id, 
                    depot => depot.usagers_id, 
                    //!!! tsy azo hatao Majiscule ny début ana variable fa sensible à la casse b ny backend sy frontend
                    (ramassage, depot) => new { 
                        usagerId = ramassage.Usagers.id,
                        matricule = ramassage.Usagers.matricule,
                        nom = ramassage.Usagers.nom,
                        prenom = ramassage.Usagers.prenom,
                        mail_ravinala = ramassage.Usagers.mail_ravinala,
                        adresse = ramassage.Usagers.adresse,
                        contact = ramassage.Usagers.contact,


                        // Informations de ramassage
                        lieuRamassage = ramassage.lieu,
                        heureRamassage = ramassage.heure_ramassage,
                        axeIdRamassage = ramassage.Axe.id,
                        axeRamassage = ramassage.Axe.axe,
                        districtRamassage = ramassage.district, 
                        fokontanyRamassage = ramassage.fokontany, 
                        estActifRamassage = ramassage.est_actif,

                        // Informations de dépôt
                        lieuDepot = depot.lieu,
                        heureDepot = depot.heure_depot,
                        axeIdDepot = depot.Axe.id,
                        axeDepot = depot.Axe.axe,
                        districtDepot = depot.district, 
                        fokontanyDepot = depot.fokontany, 
                        estActifDepot = depot.est_actif
                    }
                )
                .FirstOrDefaultAsync();

            if (ramassageDepot == null)
            {
                return NotFound();
            }

            return Ok(ramassageDepot);
        }


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
                    prenom = request.UsagerDto.prenom,
                    // date_naissance = request.UsagerDto.date_naissance?.ToUniversalTime(),
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
                        est_actif = request.Ramassage.est_actif,
                        district = request.Ramassage.district,
                        fokontany = request.Ramassage.fokontany
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
                        est_actif = request.Depot.est_actif,
                        district = request.Depot.district,
                        fokontany = request.Depot.fokontany
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

        //modifié l'information basique


        //modifié usager
        [HttpPut("update_usager_ramassage_depot/{id}")]
        public async Task<ActionResult> UpdateUsagerRamassageDepot(int id, [FromBody] UsagerRequest updateModel)
        {
            // Chercher l'usager avec l'ID spécifié
            var usager = await _context.Usagers_instance.FirstOrDefaultAsync(u => u.id == id);
            
            if (usager == null)
            {
                return NotFound("Aucun usager trouvé pour cet ID");
            }

            // Mise à jour des informations de l'usager
            usager.matricule = updateModel.UsagerDto.matricule ?? usager.matricule;
            usager.nom = updateModel.UsagerDto.nom ?? usager.nom;
            usager.prenom = updateModel.UsagerDto.prenom ?? usager.prenom;
            usager.contact = updateModel.UsagerDto.contact ?? usager.contact;
            usager.adresse = updateModel.UsagerDto.adresse ?? usager.adresse;
            usager.mail_ravinala = updateModel.UsagerDto.mail_ravinala ?? usager.mail_ravinala;
            usager.genre_id = updateModel.UsagerDto.genre_id != 0 ? updateModel.UsagerDto.genre_id : usager.genre_id;
            usager.poste_id = updateModel.UsagerDto.poste_id != 0 ? updateModel.UsagerDto.poste_id : usager.poste_id;
            usager.departement_id = updateModel.UsagerDto.departement_id != 0 ? updateModel.UsagerDto.departement_id : usager.departement_id;

            // Mise à jour des informations de ramassage
            var ramassage = await _context.Axe_usagers_ramassage_instance.FirstOrDefaultAsync(r => r.usagers_id == id);
            if (ramassage != null && updateModel.Ramassage != null)
            {
                ramassage.lieu = updateModel.Ramassage.lieu ?? ramassage.lieu;
                ramassage.heure_ramassage = updateModel.Ramassage.heure_ramassage ?? ramassage.heure_ramassage;
                ramassage.district = updateModel.Ramassage.district ?? ramassage.district;
                ramassage.fokontany = updateModel.Ramassage.fokontany ?? ramassage.fokontany;
                ramassage.est_actif = updateModel.Ramassage.est_actif;
            }

            // Mise à jour des informations de dépôt
            var depot = await _context.Axe_usagers_depot_instance.FirstOrDefaultAsync(d => d.usagers_id == id);
            if (depot != null && updateModel.Depot != null)
            {
                depot.lieu = updateModel.Depot.lieu ?? depot.lieu;
                depot.heure_depot = updateModel.Depot.heure_depot ?? depot.heure_depot;
                depot.district = updateModel.Depot.district ?? depot.district;
                depot.fokontany = updateModel.Depot.fokontany ?? depot.fokontany;
                depot.est_actif = updateModel.Depot.est_actif;
            }

            await _context.SaveChangesAsync();

            return Ok("Usager mis à jour avec succès !");
        }


        


        //supprimer un usager
        

}

}