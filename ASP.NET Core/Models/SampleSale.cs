using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ASP_NET_Core.Models;
public class SampleSale {
    public int Id { get; set; }
    public string Region { get; set; }
    public string Category { get; set; }
    public string Quarter { get; set; }
    public int Year { get; set; }
    public decimal Sales { get; set; }
}
