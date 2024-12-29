using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using package_genre;
using package_poste;
using package_departement;

using package_axe_usagers_ramassage;
using package_axe_usagers_depot;


namespace package_usagers
{
    public class Usagers
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int id { get; set; }

        [Column("matricule")]

        public string? matricule { get; set; }

        [Column("nom")]
        public string? nom { get; set; }

        [Column("prenom")]
        public string? prenom { get; set; }

        [Column("contact")]
        public string? contact { get; set; }

        [Column("mail_ravinala")]
        public string mail_ravinala { get; set; }

        [Column("genre_id")]
        public int genre_id { get; set; }


        [Column("poste_id")]
        public int poste_id { get; set; }

        [Column("departement_id")]
        public int departement_id { get; set; }


        [ForeignKey("genre_id")]
        public virtual Genre? Genre { get; set; }

        [ForeignKey("poste_id")]
        public virtual Poste? Poste { get; set; }

        [ForeignKey("departement_id")]
        public virtual Departement? Departement { get; set; }

        [Column("adresse")]
        [Required]
        public string? adresse { get; set; }

    }
}
