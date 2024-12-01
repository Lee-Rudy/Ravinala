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
using package_historique.DTOs;



using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.IO;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iText.Kernel.Font;
using iText.IO.Font.Constants;

//la date format avant : yyyy-MM-ddTHH:mm:ssZ

// using QuestPDF.Fluent;
// using QuestPDF.Helpers;
// using QuestPDF.Infrastructure;



//npm install jspdf jspdf-autotable
//dotnet add package itext7
//dotnet add package QuestPDF
//dotnet add package itext7.layout
//dotnet add package itext7.kernel 
//dotnet add package BouncyCastle.NetCore



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
                    "yyyy-MM-ddTHH:mm:ss.ffffffZ",
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
                    "yyyy-MM-ddTHH:mm:ss.ffffffZ",
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
        // Initialisation des variables par défaut
        DateTime datetimeImprevu = DateTime.MinValue;
        DateTime recuLeDate = DateTime.MinValue;
        TimeSpan recuLeTime = TimeSpan.Zero;

        // Parsing de DatetimeImprevu
        bool isImprevuParsed = DateTime.TryParseExact(
            p.DatetimeImprevu,
            "yyyy-MM-ddTHH:mm:ss.ffffffZ",
            CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
            out datetimeImprevu);

        // Parsing de RecuLe
        if (p.RecuLe != null)
        {
            recuLeDate = p.RecuLe.Date;
            recuLeTime = p.RecuLe.TimeOfDay;
        }

        // Déterminer le type d'imprévu basé sur l'heure
        string typeImprevu = "matin"; // Valeur par défaut ramasasge
        if (isImprevuParsed)
        {
            // Seuil : 15h30
            TimeSpan seuilDepot = new TimeSpan(15, 30, 0);
            if (datetimeImprevu.TimeOfDay >= seuilDepot)
            {
                typeImprevu = "soir";
            }
        }

        // Construction du DTO
        return new PointageImprevuResponseDTO
        {
            Id = p.Id,
            Matricule = p.Matricule,
            nom = p.nom,
            NomVoiture = p.NomVoiture,
            DateImprevu = isImprevuParsed ? datetimeImprevu.Date : DateTime.MinValue,
            HeureImprevu = isImprevuParsed ? datetimeImprevu.ToString("HH:mm:ss") : string.Empty,
            RecuLeDate = recuLeDate,
            RecuLeTime = recuLeTime,
            TypeImprevu = typeImprevu
        };
    }).ToList();

    return Ok(dtoList);
}





        /// <summary>
        /// Récupère le comptage des présences et absences des passagers sur une période donnée.
        /// </summary>
        /// <param name="startDate">Date de début au format YYYY-MM-DD</param>
        /// <param name="endDate">Date de fin au format YYYY-MM-DD</param>
        /// <returns>Liste des ComptageResultDTO</returns>
        /// url = GET/api/Evaluation/comptage?startDate=2024-01-01&endDate=2024-01-31



       [HttpGet("comptage")]
public async Task<ActionResult<IEnumerable<ComptageResultDTO>>> GetComptage([FromQuery] string startDate, [FromQuery] string endDate)
{
    try
    {
        var result = await ComputeComptage(startDate, endDate);
        return Ok(result);
    }
    catch (ArgumentException ex)
    {
        return BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        // Loggez l'exception ici si nécessaire
        return StatusCode(500, "Une erreur inattendue est survenue.");
    }
}

        /// <summary>
        /// Exporte le comptage des passagers sur une période donnée au format CSV.
        /// </summary>
        /// <param name="startDate">Date de début au format YYYY-MM-DD</param>
        /// <param name="endDate">Date de fin au format YYYY-MM-DD (optionnelle)</param>
        /// <returns>Fichier CSV</returns>
        [HttpGet("comptage/export/csv")]
public async Task<IActionResult> ExportComptageCSV([FromQuery] string startDate, [FromQuery] string endDate)
{
    try
    {
        var data = await ComputeComptage(startDate, endDate);

        if (data == null || !data.Any())
        {
            return BadRequest("Données de comptage invalides ou aucune donnée trouvée pour la période spécifiée.");
        }

        var csv = new StringBuilder();
        csv.AppendLine("Matricule,Date,Jour,Ramassage,Depot");

        foreach (var comptage in data)
        {
            foreach (var detail in comptage.Details)
            {
                csv.AppendLine($"{comptage.Matricule},{detail.Date:yyyy-MM-dd},{detail.Jour},{detail.RamassageStatut},{detail.DepotStatut}");
            }
            // Ajouter les totaux
            csv.AppendLine($"Total Ramassages Présents,,,{comptage.TotalRamassagePresent},");
            csv.AppendLine($"Total Dépôts Présents,,,,{comptage.TotalDepotPresent}");
            csv.AppendLine($"Total Présences,,,,{comptage.TotalPresences}");
            csv.AppendLine(); // Ligne vide
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());
        return File(bytes, "text/csv", "Comptage.csv");
    }
    catch (ArgumentException ex)
    {
        return BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        // Loggez l'exception ici si nécessaire
        return StatusCode(500, "Une erreur inattendue est survenue lors de l'exportation du CSV.");
    }
}


        /// <summary>
        /// Exporte le comptage des passagers sur une période donnée au format PDF.
        /// </summary>
        /// <param name="startDate">Date de début au format YYYY-MM-DD</param>
        /// <param name="endDate">Date de fin au format YYYY-MM-DD (optionnelle)</param>
        /// <returns>Fichier PDF</returns>
        [HttpGet("comptage/export/pdf")]
public async Task<IActionResult> ExportComptagePDF([FromQuery] string startDate, [FromQuery] string endDate)
{
    try
    {
        var data = await ComputeComptage(startDate, endDate);

        if (data == null || !data.Any())
        {
            return BadRequest("Données de comptage invalides ou aucune donnée trouvée pour la période spécifiée.");
        }

        using (var memoryStream = new MemoryStream())
        {
            PdfWriter writer = new PdfWriter(memoryStream);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            // Définir une police en gras
            var boldFont = PdfFontFactory.CreateFont(StandardFonts.HELVETICA_BOLD);

            document.Add(new Paragraph("Comptage des Passagers")
                .SetFont(boldFont)
                .SetFontSize(18)
                .SetTextAlignment(TextAlignment.CENTER));

            document.Add(new Paragraph($"Période : {startDate} au {endDate}")
                .SetFontSize(12)
                .SetTextAlignment(TextAlignment.CENTER)
                .SetMarginBottom(20));

            foreach (var comptage in data)
            {
                document.Add(new Paragraph($"Matricule : {comptage.Matricule}")
                    .SetFont(boldFont)
                    .SetFontSize(14)
                    .SetTextAlignment(TextAlignment.LEFT));

                // Créer un tableau pour les détails
                Table table = new Table(new float[] { 2, 3, 3, 3 });
                table.SetWidth(UnitValue.CreatePercentValue(100));

                // Ajouter les cellules d'en-tête avec la police en gras
                table.AddHeaderCell(new Cell().Add(new Paragraph("Date").SetFont(boldFont)));
                table.AddHeaderCell(new Cell().Add(new Paragraph("Jour").SetFont(boldFont)));
                table.AddHeaderCell(new Cell().Add(new Paragraph("Ramassage").SetFont(boldFont)));
                table.AddHeaderCell(new Cell().Add(new Paragraph("Dépôt").SetFont(boldFont)));

                foreach (var detail in comptage.Details)
                {
                    table.AddCell(new Cell().Add(new Paragraph(detail.Date.ToString("yyyy-MM-dd"))));
                    table.AddCell(new Cell().Add(new Paragraph(detail.Jour)));
                    table.AddCell(new Cell().Add(new Paragraph(detail.RamassageStatut)));
                    table.AddCell(new Cell().Add(new Paragraph(detail.DepotStatut)));
                }

                document.Add(table);

                // Ajouter les totaux
                document.Add(new Paragraph($"Total Ramassages Présents : {comptage.TotalRamassagePresent}")
                    .SetMarginTop(10));

                document.Add(new Paragraph($"Total Dépôts Présents : {comptage.TotalDepotPresent}"));
                document.Add(new Paragraph($"Total Présences : {comptage.TotalPresences}"));

                // Ajouter une ligne de séparation
                document.Add(new Paragraph(new string('-', 100))
                    .SetMarginTop(20)
                    .SetMarginBottom(20));
            }

            document.Close();
            var bytes = memoryStream.ToArray();
            return File(bytes, "application/pdf", "Comptage.pdf");
        }
    }
    catch (ArgumentException ex)
    {
        return BadRequest(ex.Message);
    }
    catch (Exception ex)
    {
        // Retourner les détails de l'exception pour le débogage
        return StatusCode(500, ex.ToString());
    }
}


//======================================================================================================
//fonction de comptage
        private async Task<List<ComptageResultDTO>> ComputeComptage(string startDate, string endDate)
{
    // Validation des paramètres
    if (!DateTime.TryParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime start))
    {
        throw new ArgumentException("La date de début est invalide. Utilisez le format YYYY-MM-DD.");
    }

    DateTime end;
    if (string.IsNullOrEmpty(endDate))
    {
        end = start;
    }
    else
    {
        if (!DateTime.TryParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out end))
        {
            throw new ArgumentException("La date de fin est invalide. Utilisez le format YYYY-MM-DD.");
        }
    }

    if (end < start)
    {
        throw new ArgumentException("La date de fin ne peut pas être antérieure à la date de début.");
    }

    // Convertir les dates en chaînes dans le même format que la base de données
    string startString = start.ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ");
    string endString = end.AddDays(1).AddTicks(-1).ToString("yyyy-MM-ddTHH:mm:ss.ffffffZ");

    // Récupérer les pointages de ramassage et dépôt dans la période en comparant les chaînes
    var ramassages = await _context.PointageRamassagePushes_instance
        .Where(p => string.Compare(p.DatetimeRamassage, startString) >= 0 &&
                    string.Compare(p.DatetimeRamassage, endString) <= 0)
        .ToListAsync();

    var depots = await _context.PointageDepotPushes_instance
        .Where(p => string.Compare(p.DatetimeDepot, startString) >= 0 &&
                    string.Compare(p.DatetimeDepot, endString) <= 0)
        .ToListAsync();

    // Obtenir tous les matricules uniques dans la période
    var matriculesRamassage = ramassages.Select(p => p.Matricule).Distinct();
    var matriculesDepot = depots.Select(p => p.Matricule).Distinct();
    var allMatricules = matriculesRamassage.Union(matriculesDepot).Distinct().ToList();

    // Créer une liste de toutes les dates dans la période
    var allDates = Enumerable.Range(0, (end - start).Days + 1)
                             .Select(d => start.AddDays(d))
                             .ToList();

    var result = new List<ComptageResultDTO>();

    foreach (var matricule in allMatricules)
    {
        var comptage = new ComptageResultDTO
        {
            Matricule = matricule,
            Details = new List<ComptageDetailDTO>()
        };

        int ramassagePresentCount = 0;
        int depotPresentCount = 0;

        foreach (var date in allDates)
        {
            var jour = date.ToString("dddd", new CultureInfo("fr-FR"));
            var dateStr = date.ToString("yyyy-MM-dd");
            var ramassage = ramassages.FirstOrDefault(p => p.Matricule == matricule && p.DatetimeRamassage.Substring(0, 10) == dateStr);
            var depot = depots.FirstOrDefault(p => p.Matricule == matricule && p.DatetimeDepot.Substring(0, 10) == dateStr);

            // Définir les statuts
            string ramassageStatut = ramassage != null && ramassage.EstPresent == "1" ? "Présent" : "Absent";
            string depotStatut = depot != null && depot.EstPresent == "1" ? "Présent" : "Absent";

            if (ramassageStatut == "Présent") ramassagePresentCount++;
            if (depotStatut == "Présent") depotPresentCount++;

            comptage.Details.Add(new ComptageDetailDTO
            {
                Date = date.Date,
                Jour = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(jour),
                RamassageStatut = ramassageStatut,
                DepotStatut = depotStatut
            });
        }

        comptage.TotalRamassagePresent = ramassagePresentCount;
        comptage.TotalDepotPresent = depotPresentCount;
        comptage.TotalPresences = ramassagePresentCount + depotPresentCount;

        result.Add(comptage);
    }

    return result;
}


        
    }
}
