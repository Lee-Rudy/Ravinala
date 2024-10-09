using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace package_login
{
    public class Login
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]
        public int id { get; set;}

        [Column("nom")]
        public string? nom { get; set;}

        [Column("mail")]
        public string? mail { get; set;}

        [Column("mot_de_passe")]
        public string? mot_de_passe { get; set;}

        [Column("est_admin")]
        public bool est_admin { get; set; }
    }
}
