// Controllers/PointageController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using package_my_db_context;
using package_historique;

namespace package_push_controller.Controllers
{
    [Route("api/historique")]
    [ApiController]
    public class PointageController : ControllerBase
    {
        private readonly MyDbContext _context;

        public PointageController(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("ramassage")]
        public async Task<ActionResult<IEnumerable<PointageRamassageResponseDTO>>> GetPointagesRamassage()
        {
            var pointages = await _context.PointageRamassagePushes_instance.ToListAsync();

            var dtoList = pointages.Select(p =>
            {
                // Parser DatetimeRamassage
                bool isRamassageParsed = DateTime.TryParseExact(
                    p.DatetimeRamassage,
                    "yyyy-MM-ddTHH:mm:ssZ",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out DateTime datetimeRamassage);

                // Parser RecuLe
                bool isRecuLeParsed = DateTime.TryParse(
                    p.RecuLe.ToString("o"), // Assuming RecuLe is already DateTime
                    out DateTime recuLeParsed);

                return new PointageRamassageResponseDTO
                {
                    Id = p.Id,
                    Matricule = p.Matricule,
                    NomUsager = p.NomUsager,
                    NomVoiture = p.NomVoiture,
                    DateRamassage = isRamassageParsed ? datetimeRamassage.Date : DateTime.MinValue,
                    HeureRamassage = isRamassageParsed ? datetimeRamassage.TimeOfDay : TimeSpan.Zero,
                    EstPresent = p.EstPresent == "1",
                    RecuLeDate = isRecuLeParsed ? recuLeParsed.Date : DateTime.MinValue,
                    RecuLeTime = isRecuLeParsed ? recuLeParsed.TimeOfDay : TimeSpan.Zero
                };
            })
            .OrderBy(dto => dto.DateRamassage)
            .ThenBy(dto => dto.HeureRamassage)
            .ToList();

            return Ok(dtoList);
        }

        /// <summary>
        /// Récupère la liste des pointages de dépôt, triés par date et heure.
        /// </summary>
        /// <returns>Liste des PointageDepotResponseDTO</returns>
        [HttpGet("depot")]
        public async Task<ActionResult<IEnumerable<PointageDepotResponseDTO>>> GetPointagesDepot()
        {
            var pointages = await _context.PointageDepotPushes_instance.ToListAsync();

            var dtoList = pointages.Select(p =>
            {
                // Parser DatetimeDepot
                bool isDepotParsed = DateTime.TryParseExact(
                    p.DatetimeDepot,
                    "yyyy-MM-ddTHH:mm:ssZ",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out DateTime datetimeDepot);

                // Parser RecuLe
                bool isRecuLeParsed = DateTime.TryParse(
                    p.RecuLe.ToString("o"), // Assuming RecuLe is already DateTime
                    out DateTime recuLeParsed);

                return new PointageDepotResponseDTO
                {
                    Id = p.Id,
                    Matricule = p.Matricule,
                    NomUsager = p.NomUsager,
                    NomVoiture = p.NomVoiture,
                    DateDepot = isDepotParsed ? datetimeDepot.Date : DateTime.MinValue,
                    HeureDepot = isDepotParsed ? datetimeDepot.TimeOfDay : TimeSpan.Zero,
                    EstPresent = p.EstPresent == "1",
                    RecuLeDate = isRecuLeParsed ? recuLeParsed.Date : DateTime.MinValue,
                    RecuLeTime = isRecuLeParsed ? recuLeParsed.TimeOfDay : TimeSpan.Zero
                };
            })
            .OrderBy(dto => dto.DateDepot)
            .ThenBy(dto => dto.HeureDepot)
            .ToList();

            return Ok(dtoList);
        }


        [HttpGet("imprevus")]
        public async Task<ActionResult<IEnumerable<PointageImprevuResponseDTO>>> GetPointagesImprevus()
        {
            var pointages = await _context.PointageUsagersImprevuPushes_instance.ToListAsync();

            var dtoList = pointages.Select(p =>
            {
                // Parser DatetimeImprevu
                bool isImprevuParsed = DateTime.TryParseExact(
                    p.DatetimeImprevu,
                    "yyyy-MM-ddTHH:mm:ssZ",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out DateTime datetimeImprevu);

                // Parser RecuLe
                bool isRecuLeParsed = DateTime.TryParse(
                    p.RecuLe.ToString("o"), // Assuming RecuLe is already DateTime
                    out DateTime recuLeParsed);

                return new PointageImprevuResponseDTO
                {
                    Id = p.Id,
                    Matricule = p.Matricule,
                    NomVoiture = p.NomVoiture,
                    DateImprevu = isImprevuParsed ? datetimeImprevu.Date : DateTime.MinValue,
                    HeureImprevu = isImprevuParsed ? datetimeImprevu.TimeOfDay : TimeSpan.Zero,
                    RecuLeDate = isRecuLeParsed ? recuLeParsed.Date : DateTime.MinValue,
                    RecuLeTime = isRecuLeParsed ? recuLeParsed.TimeOfDay : TimeSpan.Zero
                };
            })
            .OrderBy(dto => dto.DateImprevu)
            .ThenBy(dto => dto.HeureImprevu)
            .ToList();

            return Ok(dtoList);
        }
    }
}
