using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;
using System.Threading.Tasks;

using package_my_db_context;

using package_axe;
using package_usagers;
using package_axe_usagers_ramassage;
using package_axe_usagers_depot;

namespace package_map_controller
{
    [Route("api/map")]
    [ApiController]
    public class Map_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Map_controller(MyDbContext context)
        {
            _context = context;
        }


        //ramassage
        [HttpGet("liste_ramassage/{id}")]
        public async Task<ActionResult> GetMap_rammasage_id(int id)
        {
            var query = from a in _context.Axe_usagers_ramassage_instance
                        join u in _context.Usagers_instance on a.usagers_id equals u.id
                        join ax in _context.Axe_instance on a.axe_id equals ax.id
                        where a.axe_id == id && a.est_actif == true 
                        orderby a.heure_ramassage ascending
                        select new
                        {
                            a.lieu,
                            a.district,
                            a.fokontany,
                            a.heure_ramassage,
                            u.nom,
                            u.matricule,
                            ax.axe,
                            ax.duree_trajet,
                            ax.distance_km
                        };

            var result = await query.ToListAsync();

            if (result == null || result.Count == 0)
            {
                return NotFound();
            }

            // Compter le nombre de points (lieux uniques)
            var numberOfPoints = result.Select(r => r.lieu).Distinct().Count();

            // Compter le nombre d'usagers empruntant cet axe
            var numberOfUsagers = result.Select(r => r.matricule).Distinct().Count();

            // Créer un objet de réponse
            var response = new
            {
                numberOfPoints = numberOfPoints,
                numberOfUsagers = numberOfUsagers,
                details = result
            };

            return Ok(response);
        }

        //depot
        [HttpGet("liste_depot/{id}")]
        public async Task<ActionResult> GetMap_depot_id(int id)
        {
            var query = from a in _context.Axe_usagers_depot_instance
                        join u in _context.Usagers_instance on a.usagers_id equals u.id
                        join ax in _context.Axe_instance on a.axe_id equals ax.id
                        where a.axe_id == id && a.est_actif == true 
                        orderby a.heure_depot ascending
                        select new
                        {
                            a.lieu,
                            a.district,
                            a.fokontany,
                            a.heure_depot,
                            u.nom,
                            u.matricule,
                            ax.axe,
                            ax.duree_trajet,
                            ax.distance_km
                        };

            var result = await query.ToListAsync();

            if (result == null || result.Count == 0)
            {
                return NotFound();
            }

            // Compter le nombre de points (lieux uniques)
            var numberOfPoints = result.Select(r => r.lieu).Distinct().Count();

            // Compter le nombre d'usagers empruntant cet axe
            var numberOfUsagers = result.Select(r => r.matricule).Distinct().Count();

            // Créer un objet de réponse
            var response = new
            {
                numberOfPoints = numberOfPoints,
                numberOfUsagers = numberOfUsagers,
                details = result
            };

            return Ok(response);
        }

















//================================================================================
        // this code work
        // [HttpGet("liste/map/{id}")]
        // public async Task<ActionResult>GetMap_id(int id)
        // {
        //     var result = await (from a in _context.Axe_usagers_ramassage_instance
        //                         join u in _context.Usagers_instance on a.usagers_id equals u.id
        //                         join ax in _context.Axe_instance on a.axe_id equals ax.id
        //                         where a.axe_id == id
        //                         select new
        //                         {
        //                             a.lieu,
        //                             a.district,
        //                             a.fokontany,
        //                             u.nom,
        //                             u.matricule,
        //                             ax.axe,
        //                             ax.duree_trajet,
        //                             ax.distance_km
        //                         }).ToListAsync();

        //     if (result == null || result.Count == 0)
        //     {
        //         return NotFound();
        //     }

        //     return Ok(result);
        // }
    }
}