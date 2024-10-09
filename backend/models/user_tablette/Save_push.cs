using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.Runtime.InteropServices;

using package_push_week;

namespace package_save_push
{
    public class Save_push
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]

        [Column("id")]
        public int id {get; set;}

        [Column("date_save_push")]
        public DateTime date_save_push {get; set;}

        [Column("heure_save_push")]
        public TimeSpan heure_save_push {get; set;}

        [Column("push_week_id")]
        public int push_week_id {get; set;}

        [ForeignKey("push_week_id")]
        public virtual Push_week? Push_week {get; set;}
    }

}
