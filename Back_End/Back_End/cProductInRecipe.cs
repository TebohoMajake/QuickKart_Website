using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Back_End
{
    public class cProductInRecipe
    {
        public int ProductId { get; set; }
        public string ProdName { get; set; }
        public string ImageURL { get; set; }
        public int RecipeId { get; set; }
        public string RecipeName { get; set; }
        public string RecipeImage { get; set; }

    }
}