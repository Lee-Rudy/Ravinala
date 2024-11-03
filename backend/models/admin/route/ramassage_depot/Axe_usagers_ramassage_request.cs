using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq; //for jointure table

using package_axe_usagers_ramassage;



namespace package_axe_usagers_ramassage_request
{


public class Axe_usagers_ramassage_request
{
    public Axe_usagers_ramassage Ramassage { get; set; }
}
}
