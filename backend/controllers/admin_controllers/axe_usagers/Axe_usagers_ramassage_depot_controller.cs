using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

using package_my_db_context;

using package_axe_usagers_ramassage;
using package_axe_usagers_depot;

using package_usagers;
using package_axe_usagers_request;
using package_axe_usagers_ramassage_request;
using package_axe_usagers_depot_request;



namespace package_axe_usagers_ramassage_depot_controller
{
    [Route("api/axe_usagers_ramassage_depot")]
    [ApiController]
    public class Axe_usagers_ramassage_depot_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Axe_usagers_ramassage_depot_controller(MyDbContext context)
        {
            _context = context;
        }

        //modifié --> changer affectation

            //         {
            //     "Ramassage": {
            //     "lieu": "Bigody",
            //     "heure_ramassage": "05:00:00",
            //     "est_actif": false,
            //     "district": "antananarivo III",
            //     "fokontany": "Befalatanana-Ankadifotsy",
            //     "axe_id": 2
            //     },
            //     "Depot": {
            //     "lieu": "Bigody",
            //     "heure_depot": "16:00:00",
            //     "est_actif": false,
            //     "district": "antananarivo III",
            //     "fokontany": "Befalatanana-Ankadifotsy",
            //     "axe_id": 2
            //     }
            // }


        [HttpPut ("update_usager_ramassage/{id}")]
        public async Task<ActionResult> Affectation(int id, [FromBody] Axe_usagers_ramassage_request updateModel)
        {
            var ramassage = await _context.Axe_usagers_ramassage_instance.FirstOrDefaultAsync(r => r.usagers_id == id);
            if (ramassage != null && updateModel.Ramassage != null)
            {
                ramassage.lieu = updateModel.Ramassage.lieu ?? ramassage.lieu;
                ramassage.heure_ramassage = updateModel.Ramassage.heure_ramassage ?? ramassage.heure_ramassage;
                ramassage.district = updateModel.Ramassage.district ?? ramassage.district;
                ramassage.fokontany = updateModel.Ramassage.fokontany ?? ramassage.fokontany;
                ramassage.est_actif = updateModel.Ramassage.est_actif;
                ramassage.axe_id = updateModel.Ramassage.axe_id;
            }
            await _context.SaveChangesAsync();

            return Ok("Affectation modifié avec succès !");
        }


        [HttpPut ("update_usager_depot/{id}")]
        public async Task<ActionResult> Affectation(int id, [FromBody] Axe_usagers_depot_request updateModel)
        {
            var depot = await _context.Axe_usagers_depot_instance.FirstOrDefaultAsync(r => r.usagers_id == id);
            if (depot != null && updateModel.Depot != null)
            {
                depot.lieu = updateModel.Depot.lieu ?? depot.lieu;
                depot.heure_depot = updateModel.Depot.heure_depot ?? depot.heure_depot;
                depot.district = updateModel.Depot.district ?? depot.district;
                depot.fokontany = updateModel.Depot.fokontany ?? depot.fokontany;
                depot.est_actif = updateModel.Depot.est_actif;
                depot.axe_id = updateModel.Depot.axe_id;
            }
            await _context.SaveChangesAsync();

            return Ok("Affectation modifié avec succès !");
        }



        [HttpPut ("update_usager_ramassage_depot/{id}")]
        public async Task<ActionResult> Affectation(int id, [FromBody] Axe_usagers_request updateModel)
        {
            var ramassage = await _context.Axe_usagers_ramassage_instance.FirstOrDefaultAsync(r => r.usagers_id == id);
            if (ramassage != null && updateModel.Ramassage != null)
            {
                ramassage.lieu = updateModel.Ramassage.lieu ?? ramassage.lieu;
                ramassage.heure_ramassage = updateModel.Ramassage.heure_ramassage ?? ramassage.heure_ramassage;
                ramassage.district = updateModel.Ramassage.district ?? ramassage.district;
                ramassage.fokontany = updateModel.Ramassage.fokontany ?? ramassage.fokontany;
                ramassage.est_actif = updateModel.Ramassage.est_actif;
                ramassage.axe_id = updateModel.Ramassage.axe_id;
            }

            var depot = await _context.Axe_usagers_depot_instance.FirstOrDefaultAsync(d => d.usagers_id == id);
            if (depot != null && updateModel.Depot != null)
            {
                depot.lieu = updateModel.Depot.lieu ?? depot.lieu;
                depot.heure_depot = updateModel.Depot.heure_depot ?? depot.heure_depot;
                depot.district = updateModel.Depot.district ?? depot.district;
                depot.fokontany = updateModel.Depot.fokontany ?? depot.fokontany;
                depot.est_actif = updateModel.Depot.est_actif;
                depot.axe_id = updateModel.Depot.axe_id;
            }

            await _context.SaveChangesAsync();

            return Ok("Affectation modifié avec succès !");
        }


        

        [HttpGet ("liste_axe_usager_ramassage_depot/{id}")]
        public async Task<ActionResult> GetAxeUsagersRamassageDepot_id(int id)
        {
            var ramassageDepot = await _context.Axe_usagers_ramassage_instance
                .Where(ramassage => ramassage.Usagers.id == id)
                .Join(
                    _context.Axe_usagers_depot_instance, // Table de dépôt
                    ramassage => ramassage.usagers_id, // Clé pour la table de ramassage
                    depot => depot.usagers_id, // Clé pour la table de dépôt
                    //!!! tsy azo hatao Majiscule ny début ana variable fa sensible à la casse b ny backend sy frontend
                    (ramassage, depot) => new { 
                        usagerId = ramassage.Usagers.id,
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
    }
}