using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Back_End
{
    public class cProduct
    {

        public int ProductId { get; set; }
        public string ProdName { get; set; }
        public double Price { get; set; }
        public string ProdDescription { get; set; }
        public string ProdIngredients { get; set; }
        public string ProductDirections { get; set; }
        public int NumInStock { get; set; }
        public string Storage { get; set; }
        public string ImageURL { get; set; }

    }
}