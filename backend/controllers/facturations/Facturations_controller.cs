using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using package_my_db_context;
using package_facturations;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.ComponentModel.DataAnnotations;

namespace package_facturations_controller
{
    [Route("api/facturations")]
    [ApiController]
    public class FacturationsController : ControllerBase
    {
        private readonly MyDbContext _context;

        public FacturationsController(MyDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// DTO pour structurer les données de facturation.
        /// </summary>
        public class FacturationDTO
        {
            public int ContratId { get; set; }
            public string NomPrestataire { get; set; }
            public string ContratType { get; set; }
            public string NumeroFacture { get; set; }
            public DateTime DateEmission { get; set; }
            public string Designation { get; set; }
            public int NbrVehicule { get; set; }
            public int NbrJour { get; set; }
            public decimal PrixUnitaire { get; set; }
            public decimal MontantTotal { get; set; }
            public decimal Carburants { get; set; }
            public decimal NetAPayer { get; set; }
        }

        /// <summary>
        /// DTO combiné pour structurer les données de facturation et de carburant.
        /// </summary>
        public class ContratCarburantDTO
        {
            // [Required]
            public string NomPrestataire { get; set; }

            // [Required]
            public string ContratType { get; set; }

            // [Required]
            public string NumeroFacture { get; set; }

            // [Required]
            public DateTime DateEmission { get; set; }

            // [Required]
            public decimal Carburants { get; set; }

            public IFormFile ImportPdf { get; set; }

            // [Required]
            // [MinLength(1, ErrorMessage = "Au moins une prestation est requise.")]
            public List<PrestationDTO> Prestations { get; set; }
        }

        public class PrestationDTO
        {
            // [Required]
            public string Designation { get; set; }

            // [Required]
            // [Range(1, int.MaxValue, ErrorMessage = "Le nombre de véhicules doit être au moins 1.")]
            public int NbrVehicule { get; set; }

            // [Required]
            // [Range(1, int.MaxValue, ErrorMessage = "Le nombre de jours doit être au moins 1.")]
            public int NbrJour { get; set; }

            // [Required]
            // [Range(0.01, double.MaxValue, ErrorMessage = "Le prix unitaire doit être supérieur à 0.")]
            public decimal PrixUnitaire { get; set; }
        }


        /// <summary>
        /// DTO pour la mise à jour des facturations.
        /// </summary>
        public class UpdateFacturationDTO
        {
            public string NomPrestataire { get; set; }
            public string NumeroFacture { get; set; }
            public string Designation { get; set; }
            public int? NbrVehicule { get; set; }
            public int? NbrJour { get; set; }
            public decimal? PrixUnitaire { get; set; }
            public decimal? Carburants { get; set; }
            public IFormFile ImportPdf { get; set; }
        }

        /// <summary>
        /// Récupère la liste des facturations filtrées par période et type de contrat.
        /// </summary>
        /// <param name="dateDebut">Date de début de la période (optionnel).</param>
        /// <param name="dateFin">Date de fin de la période (optionnel).</param>
        /// <param name="contratType">Type de contrat : "contractuelle", "extra" ou "tous" (optionnel).</param>
        /// <returns>Liste des facturations filtrées.</returns>
        /// Exemple d'appel :
        /// http://localhost:5218/api/facturations/liste?dateDebut=2024-04-02&dateFin=2024-04-02&contratType=contractuelle

        [HttpGet("liste")]
        public async Task<ActionResult<IEnumerable<FacturationDTO>>> GetFacturations(
            [FromQuery] DateTime? dateDebut,
            [FromQuery] DateTime? dateFin,
            [FromQuery] string contratType = "tous", // Valeurs possibles : "contractuelle", "extra", "tous"
            [FromQuery] int pageNumber = 1,          // Pagination
            [FromQuery] int pageSize = 20)           // Pagination
        {
            // Validation des dates
            if (dateDebut.HasValue && dateFin.HasValue && dateDebut > dateFin)
            {
                return BadRequest("La date de début ne peut pas être supérieure à la date de fin.");
            }

            // Filtrage par type de contrat
            IQueryable<prestataire_contrat> contratsQuery = _context.Prestataire_contrat_instance;

            if (!string.IsNullOrEmpty(contratType) && contratType.ToLower() != "tous")
            {
                contratsQuery = contratsQuery.Where(c => c.contrat_type.ToLower() == contratType.ToLower());
            }

            // Filtrage par période
            if (dateDebut.HasValue)
            {
                contratsQuery = contratsQuery.Where(c => c.date_emission.Date >= dateDebut.Value.Date);
            }

            if (dateFin.HasValue)
            {
                contratsQuery = contratsQuery.Where(c => c.date_emission.Date <= dateFin.Value.Date);
            }

            // Jointure avec la table carburants
            var facturations = await (from contrat in contratsQuery
                                    join carburant in _context.Carte_carburants_instance
                                    on new
                                    {
                                        contrat.nom_prestataire,
                                        contrat.contrat_type,
                                        contrat.numero_facture,
                                        contrat.date_emission
                                    }
                                    equals new
                                    {
                                        carburant.nom_prestataire,
                                        carburant.contrat_type,
                                        carburant.numero_facture,
                                        carburant.date_emission
                                    }
                                    into carburantGroup
                                    from carburant in carburantGroup.DefaultIfEmpty()
                                    select new FacturationDTO
                                    {
                                        ContratId = contrat.id,
                                        NomPrestataire = contrat.nom_prestataire,
                                        ContratType = contrat.contrat_type,
                                        NumeroFacture = contrat.numero_facture,
                                        DateEmission = contrat.date_emission.Date, // Prendre uniquement la date
                                        Designation = contrat.designation,
                                        NbrVehicule = contrat.nbr_vehicule,
                                        NbrJour = contrat.nbr_jour,
                                        PrixUnitaire = contrat.prix_unitaire,
                                        MontantTotal = contrat.prix_unitaire * contrat.nbr_vehicule * contrat.nbr_jour,
                                        Carburants = carburant != null ? carburant.carburants : 0,
                                        NetAPayer = (contrat.prix_unitaire * contrat.nbr_vehicule * contrat.nbr_jour) - (carburant != null ? carburant.carburants : 0)
                                    })
                                    .Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            // Regrouper par date et somme des carburants par date unique
            var uniqueCarburants = facturations
                .GroupBy(f => f.DateEmission)
                .Select(g => g.First().Carburants)
                .Sum();

            // Calcul du montant final
            //decimal montantfinal
            decimal montantFinal = facturations.Sum(f => f.MontantTotal);
            decimal netPayerFinal = facturations.Sum(f => f.MontantTotal) - uniqueCarburants;

            // Ajout du MontantFinal dans la réponse si nécessaire
            var result = new
            {
                Facturations = facturations,
                MontantFinal = montantFinal,
                NetPayerFinal = netPayerFinal
            };

            return Ok(result);
        }

       

        /// <summary>
        /// Ajoute un nouveau contrat prestataire et son carburant associé.
        /// </summary>
        /// <param name="dto">Données combinées du contrat et du carburant.</param>
        /// <returns>Détails du contrat et du carburant ajoutés.</returns>
        [HttpPost("ajouter_contrat_et_carburant")]
        public async Task<ActionResult> AjouterContratEtCarburant([FromForm] ContratCarburantDTO dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Début de la transaction pour assurer l'intégrité des données
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Création de l'entité carburant
                var existingCarburant = await _context.Carte_carburants_instance
                    .FirstOrDefaultAsync(c =>
                        c.nom_prestataire == dto.NomPrestataire &&
                        c.contrat_type == dto.ContratType &&
                        c.numero_facture == dto.NumeroFacture &&
                        c.date_emission.Date == dto.DateEmission.Date &&
                        c.carburants == dto.Carburants);

                // Si aucun carburant existant, créer et ajouter une nouvelle entrée
                if (existingCarburant == null)
                {
                    var carburant = new carte_carburants
                    {
                        nom_prestataire = dto.NomPrestataire,
                        contrat_type = dto.ContratType,
                        numero_facture = dto.NumeroFacture,
                        date_emission = dto.DateEmission.Date, // Prendre uniquement la date
                        carburants = dto.Carburants
                    };

                    // Gestion du fichier PDF si fourni
                    if (dto.ImportPdf != null && dto.ImportPdf.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            await dto.ImportPdf.CopyToAsync(ms);
                            carburant.ImportPdf = ms.ToArray();
                        }
                    }

                    // Ajout de l'entité carburant
                    _context.Carte_carburants_instance.Add(carburant);
                    await _context.SaveChangesAsync();
                }

                // Création des entités prestataire_contrat pour chaque prestation
                foreach (var prestation in dto.Prestations)
                {
                    var contrat = new prestataire_contrat
                    {
                        nom_prestataire = dto.NomPrestataire,
                        contrat_type = dto.ContratType,
                        numero_facture = dto.NumeroFacture,
                        date_emission = dto.DateEmission.Date, // Prendre uniquement la date
                        designation = prestation.Designation,
                        nbr_vehicule = prestation.NbrVehicule,
                        nbr_jour = prestation.NbrJour,
                        prix_unitaire = prestation.PrixUnitaire
                    };

                    _context.Prestataire_contrat_instance.Add(contrat);
                }

                await _context.SaveChangesAsync();

                // Calcul du NetAPayer
                decimal montantTotal = dto.Prestations.Sum(p => p.PrixUnitaire * p.NbrVehicule * p.NbrJour);
                decimal carburantValue = existingCarburant != null ? existingCarburant.carburants : dto.Carburants;
                decimal netAPayer = montantTotal - carburantValue;

                // Commit de la transaction
                await transaction.CommitAsync();

                // Retourner les détails des entités créées ou existantes
                var result = new
                {
                    PrestatairesContrat = _context.Prestataire_contrat_instance
                        .Where(c => c.nom_prestataire == dto.NomPrestataire &&
                                    c.contrat_type == dto.ContratType &&
                                    c.numero_facture == dto.NumeroFacture &&
                                    c.date_emission.Date == dto.DateEmission.Date)
                        .ToList(),
                    Carburant = existingCarburant ?? _context.Carte_carburants_instance
                        .FirstOrDefault(c =>
                            c.nom_prestataire == dto.NomPrestataire &&
                            c.contrat_type == dto.ContratType &&
                            c.numero_facture == dto.NumeroFacture &&
                            c.date_emission.Date == dto.DateEmission.Date)
                };

                return CreatedAtAction(nameof(GetContratById), new { id = result.PrestatairesContrat.First().id }, result);
            }
            catch (Exception ex)
            {
                // Rollback en cas d'erreur
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erreur lors de l'insertion des données : {ex.Message}");
            }
        }


        [HttpGet("liste/pdf")]

        public async Task<ActionResult<IEnumerable<carte_carburants>>> GetPDF()
        {

            return await _context.Carte_carburants_instance.ToListAsync();

        }

        /// <summary>
        /// Supprime une ou plusieurs factures en fonction de leurs numéros de facture.
        /// </summary>
        /// <param name="numeroFactures">Liste des numéros de facture à supprimer.</param>
        /// <returns>ActionResult indiquant le résultat de l'opération.</returns>
        /// http://localhost:5218/api/facturations/supprimer_par_numero_facture?numeroFactures=N-008&numeroFactures=N-007
        [HttpDelete("supprimer_par_numero_facture")]
        public async Task<IActionResult> SupprimerParNumeroFacture([FromQuery] List<string> numeroFactures)
        {
            // Validation des paramètres
            if (numeroFactures == null || numeroFactures.Count == 0)
            {
                return BadRequest("Au moins un numéro de facture doit être fourni.");
            }

            // Supposons que numero_facture est une propriété dans Prestataire_contrat_instance et Carte_carburants_instance
            try
            {
                // Début d'une transaction pour assurer la cohérence des suppressions
                using var transaction = await _context.Database.BeginTransactionAsync();

                // Recherche des contrats correspondant aux numéros de facture
                var contrats = await _context.Prestataire_contrat_instance
                    .Where(c => numeroFactures.Contains(c.numero_facture))
                    .ToListAsync();

                if (contrats == null || contrats.Count == 0)
                {
                    return NotFound("Aucun contrat trouvé avec les numéros de facture spécifiés.");
                }

                // Recherche des carburants associés aux contrats trouvés
                var carburants = await _context.Carte_carburants_instance
                    .Where(c => numeroFactures.Contains(c.numero_facture))
                    .ToListAsync();

                // Suppression des contrats
                _context.Prestataire_contrat_instance.RemoveRange(contrats);

                // Suppression des carburants associés, le cas échéant
                if (carburants != null && carburants.Count > 0)
                {
                    _context.Carte_carburants_instance.RemoveRange(carburants);
                }

                // Sauvegarde des modifications
                await _context.SaveChangesAsync();

                // Commit de la transaction
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                // Log de l'erreur (à implémenter selon votre configuration de logging)
                // Exemple : _logger.LogError(ex, "Erreur lors de la suppression des factures.");

                return StatusCode(StatusCodes.Status500InternalServerError, $"Erreur lors de la suppression : {ex.Message}");
            }
        }



        /// <summary>
        /// Récupère un contrat par ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<prestataire_contrat>> GetContratById(int id)
        {
            var contrat = await _context.Prestataire_contrat_instance.FindAsync(id);
            if (contrat == null)
            {
                return NotFound();
            }
            return Ok(contrat);
        }

        /// <summary>
        /// Récupère un carburant par ID.
        /// </summary>
        /// ================================================
        [HttpGet("carburant/{id}")]
        public async Task<ActionResult<carte_carburants>> GetCarburantById(int id)
        {
            var carburant = await _context.Carte_carburants_instance.FindAsync(id);
            if (carburant == null)
            {
                return NotFound();
            }
            return Ok(carburant);
        }

        /// <summary>
        /// Vérifie si un contrat existe.
        /// </summary>
        /// </summary>
        /// </summary>
        /// </summary>
        /// </summary>
        /// </summary>
        /// </summary>
        /// </summary>
        /// </summary>
        /// </summary>
        /// 
        private bool ContratExiste(int id)
        {
            return _context.Prestataire_contrat_instance.Any(e => e.id == id);
        }

        /// <summary>
        /// Vérifie si un carburant existe.
        /// </summary>
        private bool CarburantExiste(int id)
        {
            return _context.Carte_carburants_instance.Any(e => e.id == id);
        }
    }
}
