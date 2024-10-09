using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using package_axe_usagers_ramassage;
using package_axe_usagers_depot;
using package_usagers;


namespace package_usager_request
{


public class UsagerRequest
{
    public Usagers UsagerDto { get; set; }
    public Axe_usagers_ramassage Ramassage { get; set; }
    public Axe_usagers_depot Depot { get; set; }
}
}
