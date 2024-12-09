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
    public class Historique_cars_controller : ControllerBase
    {
        private readonly MyDbContext _context;

        public Historique_cars_controller(MyDbContext context)
        {
            _context = context;
        }

        [HttpGet("btn")]
        public async Task<ActionResult<IEnumerable<BtnResponseDTO>>> GetBtn()
        {
            var boutons = await _context.BtnPushes_instance.ToListAsync();

            var dtoList = boutons.Select(p =>
            {
                // Parser DatetimeDepart
                bool isDateDepartParsed = DateTime.TryParseExact(
                    p.DatetimeDepart,
                    "yyyy-MM-ddTHH:mm:ss.ffffffZ",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out DateTime datetimeDepart);

                // Parser RecuLe
                bool isRecuLeParsed = DateTime.TryParse(
                    p.RecuLe.ToString("o"), // Assuming RecuLe is already DateTime
                    out DateTime recuLeParsed);

                // Parser DatetimeArrivee
                bool isDateArriveeParsed = DateTime.TryParseExact(
                    p.DatetimeArrivee,
                    "yyyy-MM-ddTHH:mm:ss.ffffffZ",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out DateTime datetimeArrivee);

                return new BtnResponseDTO
                {
                    Id = p.Id,
                    NomVoiture = p.NomVoiture,
                    motif = p.motif,
                    DatetimeDepart = isDateDepartParsed ? datetimeDepart.Date : DateTime.MinValue,
                    HeureDepart = isDateDepartParsed ? datetimeDepart.TimeOfDay : TimeSpan.Zero,
                    DatetimeArrivee = isDateArriveeParsed ? datetimeArrivee.Date : DateTime.MinValue,
                    HeureArrivee = isDateArriveeParsed ? datetimeArrivee.TimeOfDay : TimeSpan.Zero,
                    RecuLeDate = isRecuLeParsed ? recuLeParsed.Date : DateTime.MinValue,
                    RecuLeTime = isRecuLeParsed ? recuLeParsed.TimeOfDay : TimeSpan.Zero
                };
            })
            .OrderBy(dto => dto.DatetimeDepart)
            .ThenBy(dto => dto.HeureDepart)
            .ThenBy(dto => dto.DatetimeArrivee)
            .ThenBy(dto => dto.HeureArrivee)
            .ToList();

            return Ok(dtoList);
        }


        [HttpGet("km_matin")]
        public async Task<ActionResult<IEnumerable<KmMatinResponseDTO>>> GetKmMatin()
        {
            var kmMatinList = await _context.Km_matin_push_instance.ToListAsync();

            var dtoList = kmMatinList.Select(p =>
            {
                // Parsing DatetimeMatin
                bool isDatetimeMatinParsed = DateTime.TryParseExact(
                    p.DatetimeMatin,
                    "yyyy-MM-ddTHH:mm:ss.ffffffZ",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out DateTime datetimeMatin);

                // Parsing RecuLe
                bool isRecuLeParsed = DateTime.TryParse(
                    p.RecuLe.ToString("o"), // Assuming RecuLe is already DateTime
                    out DateTime recuLeParsed);

                return new KmMatinResponseDTO
                {
                    Id = p.Id,
                    Depart = p.Depart,
                    Fin = p.Fin,
                    DatetimeMatin = isDatetimeMatinParsed ? datetimeMatin.Date : DateTime.MinValue,
                    HeureMatin = isDatetimeMatinParsed ? datetimeMatin.TimeOfDay : TimeSpan.Zero,
                    NomVoiture = p.NomVoiture,
                    RecuLeDate = isRecuLeParsed ? recuLeParsed.Date : DateTime.MinValue,
                    RecuLeTime = isRecuLeParsed ? recuLeParsed.TimeOfDay : TimeSpan.Zero
                };
            })
            .OrderBy(dto => dto.DatetimeMatin)
            .ThenBy(dto => dto.HeureMatin)
            .ToList();

            return Ok(dtoList);
        }


        [HttpGet("km_soir")]
        public async Task<ActionResult<IEnumerable<KmSoirResponseDTO>>> GetKmSoir()
        {
            var kmSoirList = await _context.Km_soir_push_instance.ToListAsync();

            var dtoList = kmSoirList.Select(p =>
            {
                // Parsing DatetimeSoir
                bool isDatetimeSoirParsed = DateTime.TryParseExact(
                    p.DatetimeSoir,
                    "yyyy-MM-ddTHH:mm:ss.ffffffZ",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                    out DateTime datetimeSoir);

                // Parsing RecuLe
                bool isRecuLeParsed = DateTime.TryParse(
                    p.RecuLe.ToString("o"), // Assuming RecuLe is already DateTime
                    out DateTime recuLeParsed);

                return new KmSoirResponseDTO
                {
                    Id = p.Id,
                    Depart = p.Depart,
                    Fin = p.Fin,
                    DatetimeSoir = isDatetimeSoirParsed ? datetimeSoir.Date : DateTime.MinValue,
                    HeureSoir = isDatetimeSoirParsed ? datetimeSoir.TimeOfDay : TimeSpan.Zero,
                    NomVoiture = p.NomVoiture,
                    RecuLeDate = isRecuLeParsed ? recuLeParsed.Date : DateTime.MinValue,
                    RecuLeTime = isRecuLeParsed ? recuLeParsed.TimeOfDay : TimeSpan.Zero
                };
            })
            .OrderBy(dto => dto.DatetimeSoir)
            .ThenBy(dto => dto.HeureSoir)
            .ToList();

            return Ok(dtoList);
        }






        
    }
}
