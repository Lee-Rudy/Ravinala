using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace package_axe
{
    public class Axe
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]

        public int id {get;set;}

        [Column("axe")]
        public string? axe {get; set;}

    }
}


