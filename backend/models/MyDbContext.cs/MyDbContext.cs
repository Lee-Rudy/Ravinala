using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

//Login
using package_login;

//login cars
using package_login_cars;

//usagers
using package_poste;
using package_genre;
using package_usagers;
using package_departement;

//cars
using package_type_cars;
using package_prestataire;
using package_prestataire_archive;
using package_cars;

//conducteurs / ou aussi chauffeurs
using package_conducteurs;

//axe /route
using package_axe;
using package_axe_conducteurs;

//point de ramassage et depot
using package_axe_usagers_ramassage;
using package_axe_usagers_depot;

//pointage
using package_pointage_usagers_ramassage;
using package_pointage_usagers_depot;

//facturation
using package_facturations;

//push 
using package_push_data;

namespace package_my_db_context
{
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        // DbSets pour chaque table
        public DbSet<Login> Login_instance { get; set; }

        //login cars
        public DbSet<Login_cars> Login_cars_instance { get; set; }

        //usagers
        public DbSet<Poste> Poste_instance { get; set; }

        public DbSet<Genre> Genre_instance { get; set; }

        public DbSet<Departement> Departement_instance { get; set; }
        public DbSet<Usagers> Usagers_instance { get; set; }

         // Cars
        public DbSet<Type_cars> Type_cars_instance { get; set; }
        public DbSet<Prestataire> Prestataire_instance { get; set; }
        public DbSet<Prestataire_archive> Prestataire_archive_instance { get; set; }
        public DbSet<Cars> Cars_instance { get; set; }

        // Conducteurs
        public DbSet<Conducteurs> Conducteurs_instance { get; set; }

        // Axe / Route
        public DbSet<Axe> Axe_instance { get; set; }
        public DbSet<Axe_conducteurs> Axe_conducteurs_instance { get; set; }

        // Point de ramassage et dépôt
        public DbSet<Axe_usagers_ramassage> Axe_usagers_ramassage_instance { get; set; }
        public DbSet<Axe_usagers_depot> Axe_usagers_depot_instance { get; set; }

        // Pointage
        public DbSet<Pointage_usagers_ramassage> Pointage_usagers_ramassage_instance { get; set; }
        public DbSet<Pointage_usagers_depot> Pointage_usagers_depot_instance { get; set; }

        // Push des données from mobile into web
        public DbSet<Pointage_ramassage_push> PointageRamassagePushes_instance { get; set; }
        public DbSet<Pointage_depot_push> PointageDepotPushes_instance { get; set; }
        public DbSet<Btn_push> BtnPushes_instance { get; set; }
        public DbSet<Pointage_usagers_imprevu_push> PointageUsagersImprevuPushes_instance { get; set; }

        public DbSet<km_matin_push> Km_matin_push_instance { get; set; }
        public DbSet<km_soir_push> Km_soir_push_instance { get; set; }

        //facturation
        public DbSet<prestataire_contrat> Prestataire_contrat_instance { get; set; }
        public DbSet<carte_carburants> Carte_carburants_instance { get; set; }





    //utilisation des classes et tables ========================================
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Appliquer une configuration par défaut pour chaque entité trouvée
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // Utiliser le nom de la classe en minuscule comme nom de table
                modelBuilder.Entity(entityType.ClrType)
                    .ToTable(entityType.ClrType.Name.ToLower());

                // Configurer la clé primaire et renommer les colonnes
                var primaryKey = entityType.FindPrimaryKey();
                if (primaryKey != null)
                {
                    var keyProperty = primaryKey.Properties.FirstOrDefault();
                    if (keyProperty != null)
                    {
                        modelBuilder.Entity(entityType.ClrType)
                            .HasKey(keyProperty.Name);
                        
                        // Renommer la colonne clé primaire en minuscule
                        modelBuilder.Entity(entityType.ClrType)
                            .Property(keyProperty.Name)
                            .HasColumnName(keyProperty.Name.ToLower());
                    }
                }
            }
        }
    }
}