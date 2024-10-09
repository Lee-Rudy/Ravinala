using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace package_poste
{
    public class Poste
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("id")]
        public int id{get;set;}

        [Column("poste")]
        public string? poste{get;set;}
    }
}
