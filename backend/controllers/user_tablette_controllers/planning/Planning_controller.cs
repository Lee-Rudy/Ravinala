using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using package_axe;
using package_cars;
using package_usagers;
using package_my_db_context;
using package_axe_usagers_ramassage;
using package_axe_usagers_depot;

namespace package_planning_controller
{
    [Route("api/planning")]
    [ApiController]
    public class Planning_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Planning_controller(MyDbContext context)
        {
            _context = context;
        }

        // DTO pour le planning de ramassage
        public class PlanningRamassageDto
        {
            public int IdUsagers {get; set;}

            public string Matricule { get; set; }
            public string NomUsager { get; set; }
            public string NomAxe { get; set; }
            // public string PrenomUsager { get; set; }            
            public string NomVoiture { get; set; }
            // public string Immatriculation { get; set; }            
            // public  int IdCar { get; set; }

            public string Fokontany { get; set; }
            public string Lieu { get; set; }
            public TimeSpan Heure { get; set; }
        }

        // DTO pour le planning de dépôt
        public class PlanningDepotDto
        {
            public int IdUsagers {get; set;}
            public string Matricule { get; set; }
            public string NomUsager { get; set; }
            public string NomAxe { get; set; }
            // public string PrenomUsager { get; set; }            

            public string NomVoiture { get; set; }
            // public string Immatriculation { get; set; }            

            // public  int IdCar { get; set; }
            public string Fokontany { get; set; }
            public string Lieu { get; set; }
            public TimeSpan Heure { get; set; }
        }

        // Méthode pour obtenir le planning de ramassage
        [HttpGet("liste_ramassage")]
        public async Task<ActionResult<IEnumerable<PlanningRamassageDto>>> GetPlanningRamassage()
        {
            var result = await _context.Usagers_instance
                .Join(_context.Axe_usagers_ramassage_instance.Where(aur => aur.est_actif == true), 
                    u => u.id,
                    aur => aur.usagers_id,
                    (u, aur) => new { u, aur })
                .Join(_context.Axe_instance,
                    combined => combined.aur.axe_id,
                    a => a.id,
                    (combined, a) => new { combined.u, combined.aur, a })
                .Join(_context.Axe_conducteurs_instance,
                    combined => combined.a.id,
                    ac => ac.axe_id,
                    (combined, ac) => new { combined.u, combined.aur, combined.a, ac })
                .Join(_context.Cars_instance,
                    combined => combined.ac.cars_id,
                    c => c.id,
                    (combined, c) => new PlanningRamassageDto
                    {
                        IdUsagers = combined.u.id,
                        Matricule = combined.u.matricule,
                        NomUsager = combined.u.nom,
                        NomAxe = combined.a.axe,
                        NomVoiture = c.nom_car,
                        // Immatriculation = c.immatriculation,
                        // IdCar = c.id,
                        Fokontany = combined.aur.fokontany,
                        Lieu = combined.aur.lieu,
                        Heure = combined.aur.heure_ramassage ?? default(TimeSpan)
                    })
                .Where(p => p.Heure != null && p.Lieu != null)
                .OrderBy(p => p.NomVoiture)
                .ThenBy(p => p.Heure)
                .ToListAsync();

            return Ok(result);
        }

        // Méthode pour obtenir le planning de dépôt
        [HttpGet("liste_depot")]
        public async Task<ActionResult<IEnumerable<PlanningDepotDto>>> GetPlanningDepot()
        {
            var result = await _context.Usagers_instance
                .Join(_context.Axe_usagers_depot_instance.Where(aud => aud.est_actif == true), 
                    u => u.id,
                    aud => aud.usagers_id,
                    (u, aud) => new { u, aud })
                .Join(_context.Axe_instance,
                    combined => combined.aud.axe_id,
                    a => a.id,
                    (combined, a) => new { combined.u, combined.aud, a })
                .Join(_context.Axe_conducteurs_instance,
                    combined => combined.a.id,
                    ac => ac.axe_id,
                    (combined, ac) => new { combined.u, combined.aud, combined.a, ac })
                .Join(_context.Cars_instance,
                    combined => combined.ac.cars_id,
                    c => c.id,
                    (combined, c) => new PlanningDepotDto
                    {
                        IdUsagers = combined.u.id,
                        Matricule = combined.u.matricule,
                        NomUsager = combined.u.nom,
                        NomAxe = combined.a.axe,
                        NomVoiture = c.nom_car,
                        // Immatriculation = c.immatriculation,
                        // IdCar = c.id,
                        Fokontany = combined.aud.fokontany,
                        Lieu = combined.aud.lieu,
                        Heure = combined.aud.heure_depot ?? default(TimeSpan)
                    })
                .Where(p => p.Heure != null && p.Lieu != null)
                .OrderBy(p => p.NomVoiture)
                .ThenBy(p => p.Heure)
                .ToListAsync();

            return Ok(result);
        }


        //for mobile 
        //new , mbola tsy miasa 
        
        //id_car = id
       [HttpGet("liste_ramassage_mobile/{nom_car}")]
        public async Task<ActionResult<IEnumerable<PlanningRamassageDto>>> GetPlanningRamassageMobile(string nom_car)
        {
            var result = await _context.Usagers_instance
                .Join(_context.Axe_usagers_ramassage_instance.Where(aur => aur.est_actif == true), 
                    u => u.id,
                    aur => aur.usagers_id,
                    (u, aur) => new { u, aur })
                .Join(_context.Axe_instance,
                    combined => combined.aur.axe_id,
                    a => a.id,
                    (combined, a) => new { combined.u, combined.aur, a })
                .Join(_context.Axe_conducteurs_instance,
                    combined => combined.a.id,
                    ac => ac.axe_id,
                    (combined, ac) => new { combined.u, combined.aur, combined.a, ac })
                .Join(_context.Cars_instance.Where(c => c.nom_car == nom_car), // Appliquez le filtre ici
                    combined => combined.ac.cars_id,
                    c => c.id,
                    (combined, c) => new PlanningRamassageDto
                    {
                        IdUsagers = combined.u.id,
                        Matricule = combined.u.matricule,
                        NomUsager = combined.u.prenom,
                        // PrenomUsager = combined.u.prenom,
                        NomAxe = combined.a.axe,
                        // IdCar = c.id,
                        NomVoiture = c.nom_car,
                        // Immatriculation = c.immatriculation,
                        Fokontany = combined.aur.fokontany,
                        Lieu = combined.aur.lieu,
                        Heure = combined.aur.heure_ramassage ?? default(TimeSpan)
                    })
                .Where(p => p.Heure != null && p.Lieu != null)
                .OrderBy(p => p.NomAxe)
                .ThenBy(p => p.NomVoiture)
                .ThenBy(p => p.Heure)
                .ToListAsync();

            return Ok(result);
        }

        //id_car = id
        [HttpGet("liste_depot_mobile/{nom_car}")]
        public async Task<ActionResult<IEnumerable<PlanningDepotDto>>> GetPlanningDepotMobile(string nom_car)
        {
            var result = await _context.Usagers_instance
                .Join(_context.Axe_usagers_depot_instance.Where(aur => aur.est_actif == true), 
                    u => u.id,
                    aur => aur.usagers_id,
                    (u, aur) => new { u, aur })
                .Join(_context.Axe_instance,
                    combined => combined.aur.axe_id,
                    a => a.id,
                    (combined, a) => new { combined.u, combined.aur, a })
                .Join(_context.Axe_conducteurs_instance,
                    combined => combined.a.id,
                    ac => ac.axe_id,
                    (combined, ac) => new { combined.u, combined.aur, combined.a, ac })
                .Join(_context.Cars_instance.Where(c => c.nom_car == nom_car), // Appliquez le filtre ici
                    combined => combined.ac.cars_id,
                    c => c.id,
                    (combined, c) => new PlanningDepotDto
                    {
                        IdUsagers = combined.u.id,
                        Matricule = combined.u.matricule,
                        NomUsager = combined.u.prenom,
                        // PrenomUsager = combined.u.prenom,
                        NomAxe = combined.a.axe,
                        // IdCar = c.id,
                        NomVoiture = c.nom_car,
                        // Immatriculation = c.immatriculation,
                        Fokontany = combined.aur.fokontany,
                        Lieu = combined.aur.lieu,
                        Heure = combined.aur.heure_depot ?? default(TimeSpan)
                    })
                .Where(p => p.Heure != null && p.Lieu != null)
                .OrderBy(p => p.NomAxe)
                .ThenBy(p => p.NomVoiture)
                .ThenBy(p => p.Heure)
                .ToListAsync();

            return Ok(result);
        }





    }
}
