using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using package_axe_usagers_ramassage;
using package_axe_usagers_depot;



namespace package_axe_usagers_request
{


public class Axe_usagers_request
{
    public Axe_usagers_ramassage Ramassage { get; set; }
    public Axe_usagers_depot Depot { get; set; }
}
}
