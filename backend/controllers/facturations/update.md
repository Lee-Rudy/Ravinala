/// <summary>
        /// Met à jour un contrat et son carburant basé sur la date et le type de contrat.
        /// </summary>
        /// <param name="dateEmission">Date d'émission des contrats à mettre à jour.</param>
        /// <param name="contratType">Type de contrat ("contractuelle" ou "extra").</param>
        /// <param name="updateDto">Données mises à jour.</param>
        /// <returns>Action résultat.</returns>
        /// 
        /// 
        /// mbola tsy mandeha
        [HttpPut("mettre_a_jour_par_date_type")]
        public async Task<IActionResult> MettreAJourParDateEtType(
            [FromQuery] DateTime dateEmission,
            [FromQuery] string contratType,
            [FromBody] UpdateFacturationDTO updateDto)
        {
            if (string.IsNullOrEmpty(contratType))
            {
                return BadRequest("Le type de contrat est requis.");
            }

            // Recherche des contrats correspondant à la date et au type de contrat
            var contrats = await _context.Prestataire_contrat_instance
                .Where(c => c.date_emission.Date == dateEmission.Date && c.contrat_type.ToLower() == contratType.ToLower())
                .ToListAsync();

            if (contrats == null || contrats.Count == 0)
            {
                return NotFound("Aucun contrat trouvé avec la date et le type spécifiés.");
            }

            // Début de la transaction pour assurer l'intégrité des données
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                foreach (var contrat in contrats)
                {
                    // Mise à jour des champs du contrat
                    if (!string.IsNullOrEmpty(updateDto.NomPrestataire))
                    {
                        contrat.nom_prestataire = updateDto.NomPrestataire;
                    }

                    if (!string.IsNullOrEmpty(updateDto.NumeroFacture))
                    {
                        contrat.numero_facture = updateDto.NumeroFacture;
                    }

                    if (!string.IsNullOrEmpty(updateDto.Designation))
                    {
                        contrat.designation = updateDto.Designation;
                    }

                    if (updateDto.NbrVehicule.HasValue && updateDto.NbrVehicule.Value > 0)
                    {
                        contrat.nbr_vehicule = updateDto.NbrVehicule.Value;
                    }

                    if (updateDto.NbrJour.HasValue && updateDto.NbrJour.Value > 0)
                    {
                        contrat.nbr_jour = updateDto.NbrJour.Value;
                    }

                    if (updateDto.PrixUnitaire.HasValue && updateDto.PrixUnitaire.Value > 0)
                    {
                        contrat.prix_unitaire = updateDto.PrixUnitaire.Value;
                    }

                    // Calcul du montant total
                    decimal montantTotal = contrat.prix_unitaire * contrat.nbr_vehicule * contrat.nbr_jour;

                    // Mise à jour du carburant correspondant
                    var carburant = await _context.Carte_carburants_instance
                        .Where(c => c.nom_prestataire == contrat.nom_prestataire &&
                                    c.contrat_type.ToLower() == contrat.contrat_type.ToLower() &&
                                    c.numero_facture == contrat.numero_facture &&
                                    c.date_emission.Date == contrat.date_emission.Date)
                        .FirstOrDefaultAsync();

                    if (carburant != null)
                    {
                        if (updateDto.Carburants.HasValue && updateDto.Carburants.Value >= 0)
                        {
                            carburant.carburants = updateDto.Carburants.Value;
                        }

                        if (updateDto.ImportPdf != null && updateDto.ImportPdf.Length > 0)
                        {
                            using (var ms = new MemoryStream())
                            {
                                await updateDto.ImportPdf.CopyToAsync(ms);
                                carburant.ImportPdf = ms.ToArray();
                            }
                        }

                        // Calcul net à payer
                        decimal netAPayer = montantTotal - carburant.carburants;

                        // Puisque 'NetAPayer' n'est pas une propriété du modèle, il est calculé dans le DTO lors de la récupération des données
                    }
                    else
                    {
                        // Si aucun carburant n'est trouvé, vous pouvez choisir de créer un nouveau carburant ou de laisser NetAPayer égal à MontantTotal
                        // Ici, nous ne créons pas de nouveau carburant et NetAPayer sera égal à MontantTotal dans le DTO
                    }

                    // Mise à jour des entités dans le contexte
                    _context.Prestataire_contrat_instance.Update(contrat);

                    if (carburant != null)
                    {
                        _context.Carte_carburants_instance.Update(carburant);
                    }
                }

                await _context.SaveChangesAsync();

                // Commit de la transaction
                await transaction.CommitAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                // Rollback en cas d'erreur
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, $"Erreur lors de la mise à jour des données : {ex.Message}");
            }
        }