using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace package_type_cars
{
    public class Type_cars
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("id")]

        public int id {get;set;}

        [Column("type_car")]
        public string? type_cars {get; set;}

    }
}


