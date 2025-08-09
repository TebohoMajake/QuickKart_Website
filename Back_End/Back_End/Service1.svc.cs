using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using HashPass;

namespace Back_End
{
    //I broke something and came back here
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    public class Service1 : IService1
    {

        //Create Database context
        DataClasses1DataContext db = new DataClasses1DataContext();

        public bool AddProduct(string prodName, decimal price, string prodDescription, string prodIngredients, string prodDirections, string storage, int numInStock, string imageURL)
        {

            var newProd = new Product
            {

                ProdName = prodName,
                Price = price,
                ProdDescription = prodDescription,
                ProdIngredients = prodIngredients,
                ProductDirections = prodDirections,
                Storage = storage,
                NumInStock = numInStock,
                ImageURL = imageURL

            };

            db.Products.InsertOnSubmit(newProd);
            db.SubmitChanges();

            //Create a object to track sales
            var newSoldProd = new SoldProduct
            {

                ProductId = newProd.ProductId,
                Sales = 0

            };

            db.SoldProducts.InsertOnSubmit(newSoldProd);
            db.SubmitChanges();

            return true;

        }

        public bool EditProduct(int productId, string prodName, decimal price, string prodDescription, string prodIngredients, string prodDirections, string storage, int numInStock, string imageURL)
        {
            //Store the Product object from database
            var prod = db.Products.FirstOrDefault(p => p.ProductId == productId);

            if(prod != null)
            {
                prod.ProdName = prodName;
                prod.Price = price;
                prod.ProdDescription = prodDescription;
                prod.ProdIngredients = prodIngredients;
                prod.ProductDirections = prodDirections;
                prod.Storage = storage;
                prod.NumInStock = numInStock;
                prod.ImageURL = imageURL;

                db.SubmitChanges();

                return true;
            }

            return false;

        }

        public List<cCategory> GetCategories()
        {
            //create necessary variables
            dynamic categories = db.Categories.DefaultIfEmpty();
            List<cCategory> lCategories = new List<cCategory>();

            //Check if null
            if(categories == null)
            {
                return null;
            }
            else
            {
                //Populate the final list
                foreach(Category c in categories)
                {

                    lCategories.Add(ConvToSendableCategory(c));

                }

                //Return the list of categories
                return lCategories;

            }

        }

        public cCategory GetCategory(int categoryId)
        {
            //Store the Category object from database
            var category = db.Categories.FirstOrDefault(c => c.CategoryId == categoryId);

            if(category == null)
            {
                return null;
            }
            else
            {
                return ConvToSendableCategory(category);
            }
        }

        private cCategory ConvToSendableCategory(Category c)
        {

            var catToSend = new cCategory
            {

                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName

            };

            return catToSend;

        }

        public FitnessGoal GetFitnessGoal(int fitnessGoalId)
        {

            //Store the FitnessGoal object from database
            var fGoal = db.FitnessGoals.FirstOrDefault(c => c.FitnessGoalId == fitnessGoalId);

            if (fGoal == null)
            {
                return null;
            }
            else
            {
                return fGoal;
            }

        }

        public List<cFitnessGoal> GetFitnessGoals()
        {

            //create necessary variables
            dynamic fGoals = db.FitnessGoals.DefaultIfEmpty();
            List<cFitnessGoal> lFGoals = new List<cFitnessGoal>();

            //Check if null
            if (fGoals != null)
            {
                //Populate the final list
                foreach (FitnessGoal fg in fGoals)
                {
                    var goal = ConvToSendableGoal(fg);
                    lFGoals.Add(goal);

                }

                //Return the list of categories
                return lFGoals;
            }
            else
            {
                return null;

            }

        }

        public cProduct GetProduct(int productId)
        {

            //Store the Product object from database
            var prod = db.Products.FirstOrDefault(p => p.ProductId == productId);

            if (prod == null)
            {
                return null;
            }
            else
            {
                return ConvToSendableProduct(prod);
            }

        }

        public List<ProductRating> GetProductRatings(int productId)
        {

            //create necessary variables
            dynamic ratings = db.ProductRatings.Where(r => r.ProductId == productId).DefaultIfEmpty();
            List<ProductRating> lRatings = new List<ProductRating>();

            //Check if null
            if (ratings == null)
            {
                return null;
            }
            else
            {
                //Populate the final list
                foreach (ProductRating r in ratings)
                {

                    lRatings.Add(r);

                }

                //Return the list of categories
                return lRatings;

            }

        }

        public List<cProduct> GetProducts()
        {

            //create necessary variables
            dynamic products = db.Products.DefaultIfEmpty();
            List<cProduct> lProducts = new List<cProduct>();

            //Check if null
            if (products == null)
            {
                return null;
            }
            else
            {
                
                //Populate the final list
                foreach (Product p in products)
                {

                    var prodToSend = ConvToSendableProduct(p);

                    lProducts.Add(prodToSend);

                }
                
                //Return the list of categories
                return lProducts;

            }

        }

        private cProduct ConvToSendableProduct(Product p)
        {

            var prodToSend = new cProduct
            {
                ProductId = p.ProductId,
                ProdName = p.ProdName,
                Price = (double)p.Price,
                NumInStock = p.NumInStock,
                ProdDescription = p.ProdDescription,
                ProdIngredients = p.ProdIngredients,
                ProductDirections = p.ProductDirections,
                ImageURL = p.ImageURL,
                Storage = p.Storage
            };

            return prodToSend;

        }

        public List<cProductInCart> GetProductsInCart(int customerId)
        {

            dynamic prodIds = db.ProductInCarts.Where(p => p.CustomerId == customerId).Select(p => p.ProductId).ToList();

            List<cProductInCart> prods = new List<cProductInCart>();
            foreach(int p in prodIds)
            {

                //var prod = db.Products.Where(pr => pr.ProductId == p).FirstOrDefault();
                var prod = GetProduct(p);

                var prodInC = db.ProductInCarts.Where(pic => pic.CustomerId == customerId && pic.ProductId == p).FirstOrDefault();
                var prodQuantity = prodInC.Quantity;

                if(prod != null)
                {
                    prods.Add(ConvToSendableProductInCart(prod, prodQuantity));
                }

            }

            return prods;

        }

        private cProductInCart ConvToSendableProductInCart(cProduct p, int quantity)
        {

            var productToSend = new cProductInCart
            {

                ProductId = p.ProductId,
                ProdName = p.ProdName,
                Price = (double)p.Price,
                ProdDescription = p.ProdDescription,
                ProdIngredients = p.ProdIngredients,
                ProductDirections = p.ProductDirections,
                ImageURL = p.ImageURL,
                Storage = p.Storage,
                NumInStock = p.NumInStock,

                Quantity = quantity

            };

            return productToSend;

        }

        public List<cProduct> GetProductsInCategory(int categoryId)
        {

            dynamic prodIds = db.ProductInCatergories.Where(p => p.CategoryId == categoryId).Select(p => p.ProductId).ToList();

            List<cProduct> prods = new List<cProduct>();
            foreach(int p in prodIds)
            {

                var prod = db.Products.Where(pr => pr.ProductId == p).FirstOrDefault();

                if(prod != null)
                {
                    prods.Add(ConvToSendableProduct(prod));
                }

            }

            return prods;

        }

        public List<Product> GetProductsInGoal(int fitnessGoalId)
        {
            throw new NotImplementedException();
        }

        public List<cProduct> GetProductsInRecipe(int recipeId)
        {
            var productsInRecipe = from pir in db.ProductInRecipes
                                   join p in db.Products on pir.ProductId equals p.ProductId
                                   where recipeId == pir.RecipeId
                                   select p;

            List<cProduct> lProducts = new List<cProduct>();
            if (productsInRecipe != null)
            {
                foreach (Product p in productsInRecipe)
                {
                    var prodToSend = ConvToSendableProduct(p);
                    lProducts.Add(prodToSend);
                }



            }
            return lProducts;
        }

        private cProductInRecipe ConvToSendableProductInRecipe(Product p)
        {
            var productToSend = new cProductInRecipe
            {

                ProductId = p.ProductId,
                ProdName = p.ProdName,
                ImageURL = p.ImageURL,
            };
            return productToSend;
        }

        public Recipe GetRecipe(int recipeId)
        {
            // Retriee the recipe from the db based on the  recipeId
            var recipe = db.Recipes.FirstOrDefault(r => r.RecipeId == recipeId);

          
            if (recipe == null)
            {
                return null;
            }

            var recp = new Recipe
            {

                RecipeId = recipe.RecipeId,
                RecipeImage = recipe.RecipeImage,
                RecipeName = recipe.RecipeName,
                RecipeDescription = recipe.RecipeDescription,
                RecipeInstructions = recipe.RecipeInstructions,
                RecipeIngredients = recipe.RecipeIngredients

            };

            // Return object
            return recp;
        }

        public List<Recipe> GetRecipes()
        {
            //return db.Recipes.ToList();

            dynamic recipies = db.Recipes.DefaultIfEmpty();
            List<Recipe> lRecipies = new List<Recipe>();

            foreach(Recipe r in recipies)
            {

                if(r != null)
                {

                    var recp = new Recipe
                    {

                        RecipeId = r.RecipeId,
                        RecipeImage = r.RecipeImage,
                        RecipeName = r.RecipeName,
                        RecipeDescription = r.RecipeDescription

                    };

                    lRecipies.Add(recp);

                }

            }

            return lRecipies;

        }

        public List<Recipe> GetRecipesInGoal(int fitnessGoalId)
        {
            dynamic rig = (from r in db.RecipeInGoals
                           where r.FitnessGoalId == fitnessGoalId
                           select r).DefaultIfEmpty();

            List<Recipe> lRecipes = new List<Recipe>();

            foreach (RecipeInGoal rec in rig)
            {
                if (rec != null)
                {
                    var recipe = db.Recipes.FirstOrDefault(r => r.RecipeId == rec.RecipeId);

                    if (recipe != null)
                    {
                        var recp = new Recipe
                        {

                            RecipeId = recipe.RecipeId,
                            RecipeImage = recipe.RecipeImage,
                            RecipeName = recipe.RecipeName,
                            RecipeDescription = recipe.RecipeDescription

                        };

                        lRecipes.Add(recp);
                    }
                }
            }

            return lRecipes;
        }



        public bool AddRecipe(string recipeName, string recipeDescription, string recipeInstructions, string recipeIngredients, string recipeImage)
        {
            var newRecipe = new Recipe
            {
                RecipeName = recipeName,
                RecipeDescription = recipeDescription,
                RecipeInstructions = recipeInstructions,
                RecipeIngredients = recipeIngredients,
                RecipeImage = recipeImage
            };

            db.Recipes.InsertOnSubmit(newRecipe);
            db.SubmitChanges();

            return true;
        }

        public bool EditRecipe(int recipeId, string recipeName, string recipeDescription, string recipeInstructions, string recipeIngredients, string recipeImage)
        {
            var recipe = db.Recipes.FirstOrDefault(r => r.RecipeId == recipeId);
            if (recipe != null)
            {
                recipe.RecipeName = recipeName;
                recipe.RecipeDescription = recipeDescription;
                recipe.RecipeInstructions = recipeInstructions;
                recipe.RecipeIngredients = recipeIngredients;
                recipe.RecipeImage = recipeImage;

                db.SubmitChanges();
                return true;
            }
            return false;
        }


        public bool DeleteRecipe(int recipeId)
        {
            var recipe = db.Recipes.FirstOrDefault(r => r.RecipeId == recipeId);
            if (recipe != null)
            {
                db.Recipes.DeleteOnSubmit(recipe);
                db.SubmitChanges();
                return true;
            }
            return false;
        }



        public List<Recipe> SearchRecipesByName(string searchTerm)
        {
            return db.Recipes.Where(r => r.RecipeName.Contains(searchTerm)).ToList();
        }




        public cUser Login(string email, string password)
        {

            var user = db.Users.Where(u => u.Email == email && u.Password == Secrecy.HashPassword(password)).FirstOrDefault();

            if(user != null)
            {

                return ConvToSendableUser(user);

            }
            else
            {
                return null;
            }

        }

        private cUser ConvToSendableUser(User u)
        {

            var userToSend = new cUser
            {

                UserId = u.Id,
                FirstName = u.FirstName,
                Surname = u.LastName,
                Email = u.Email,
                UserType = u.UserType,
                RegDate = (DateTime)u.RegDate

            };

            return userToSend;

        }

        public bool RegisterUser(string firstName, string surname, string email, string password, string userType, int fGoal)
        {

            var newUser = new User
            {

                FirstName = firstName,
                LastName = surname,
                Email = email,
                Password = Secrecy.HashPassword(password),
                UserType = userType,
                RegDate = DateTime.Now

            };

            //Check if everything is valid

            var oldUser = (from u in db.Users
                           where u.Email == email
                           select u).FirstOrDefault();

            if(oldUser == null)
            {
                try
                {
                    db.Users.InsertOnSubmit(newUser);
                    db.SubmitChanges();

                    //Check if the user is a customer
                    if(userType == "Customer")
                    {

                        var user = db.Users.Where(u => u.Email == email && u.Password == Secrecy.HashPassword(password)).FirstOrDefault();

                        var newCustomer = new Customer
                        {
                            CustomerId = user.Id,
                            FitnessGoal = fGoal
                        };

                        db.Customers.InsertOnSubmit(newCustomer);
                        db.SubmitChanges();

                    }

                    return true;
                }
                catch (Exception e)
                {

                    return false;

                }
            }
            else
            {
                return false;
            }

        }

        public bool AddProductInCart(int customerId, int productId, int quantity)
        {

            var customer = db.Customers.Where(c => c.CustomerId == customerId).FirstOrDefault();
            var product = db.Products.Where(p => p.ProductId == productId).FirstOrDefault();

            if(customer != null && product != null)
            {

                var pic = db.ProductInCarts.Where(p => p.CustomerId == customerId && p.ProductId == productId).FirstOrDefault();

                if(pic == null)
                {

                    var newPIC = new ProductInCart
                    {

                        CustomerId = customerId,
                        ProductId = productId,
                        Quantity = quantity

                    };

                    db.ProductInCarts.InsertOnSubmit(newPIC);
                    db.SubmitChanges();

                    return true;

                }
                else
                {

                    return false;

                }
            }
            else
            {
                return false;
            }

        }

        public bool RemoveProductInCart(int customerId, int productId)
        {

            var product = db.ProductInCarts.Where(p => p.CustomerId == customerId && p.ProductId == productId);

            if(product != null)
            {

                db.ProductInCarts.DeleteAllOnSubmit(product);
                db.SubmitChanges();

                return true;
            }
            else
            {
                return false;
            }

        }

        public bool EditProductInCart(int customerId, int productId, int quantity)
        {

            var prodInCart = (from p in db.ProductInCarts
                              where p.CustomerId == customerId && p.ProductId == productId
                              select p).FirstOrDefault();

            if(prodInCart != null)
            {

                prodInCart.Quantity = quantity;

                db.SubmitChanges();

                return true;

            }
            else
            {
                return false;
            }

        }

        public cProductInCart GetProductInCart(int customerId, int productId)
        {

            var prodInC = (from p in db.ProductInCarts
                       where p.CustomerId == customerId && p.ProductId == productId
                       select p).FirstOrDefault();

            if(prodInC != null)
            {

                var prod = GetProduct(productId);
                int quantity = prodInC.Quantity;

                return ConvToSendableProductInCart(prod, quantity);

            }
            else
            {
                return null;
            }

        }

        public List<cInvoice> GetInvoices(int customerId)
        {

            dynamic ins = (from i in db.Invoice2s
                           where i.CustomerId == customerId
                           select i).DefaultIfEmpty();

            List<cInvoice> lIns = new List<cInvoice>();

            foreach(Invoice2 i in ins)
            {

                if(i != null)
                {
                    var tempIn = new cInvoice
                    {
                        InvoiceId = i.InvoiceId,
                        CustomerId = i.CustomerId,
                        InvoiceDate = i.InvoiceDate.ToString("yyyy-MM-dd"),
                        TotalAmount = i.TotalAmount
                    };

                    lIns.Add(tempIn);
                }

            }

            return lIns;

        }

        
        public cInvoice GetInvoice(int invoiceId)
        {

            var invoice = (from i in db.Invoice2s
                           where i.InvoiceId == invoiceId
                           select i).FirstOrDefault();

            if(invoice != null)
            {

                var tempIn = new cInvoice
                {
                    InvoiceId = invoice.InvoiceId,
                    CustomerId = invoice.CustomerId,
                    InvoiceDate = invoice.InvoiceDate.ToString(),
                    TotalAmount = invoice.TotalAmount
                };

                return tempIn;

            }
            else
            {
                return null;
            }

        }


        public List<ProductInInvoice> GetProductsInInvoice(int invoiceId)
        {

            dynamic prods = (from p in db.ProductInInvoices
                             where p.InvoiceId == invoiceId
                             select p).DefaultIfEmpty();

            List<ProductInInvoice> lprods = new List<ProductInInvoice>();

            foreach(ProductInInvoice p in prods)
            {

                if(p != null)
                {

                    var newProds = new ProductInInvoice
                    {
                        InvoiceId = p.InvoiceId,
                        ProductId = p.ProductId,
                        ProdName = p.ProdName,
                        Price = p.Price,
                        QTY = p.QTY,
                        Total = p.Total
                    };

                    lprods.Add(newProds);

                }

            }

            return lprods;

        }


        public bool AddProductInInvoice(int invoiceId, int productId, string prodName, decimal price, int qty, decimal total)
        {

            var invoice = (from i in db.Invoice2s
                           where i.InvoiceId == invoiceId
                           select i).FirstOrDefault();

            

            //Get the category id
            int catId = 0;

            if(productId > 0)
            {

                //Get the categoryId
                ProductInCatergory prodInCat = (from p in db.ProductInCatergories
                                                where p.ProductId == productId
                                                select p).FirstOrDefault();

        
                 if(prodInCat != null)
                {
                    catId = prodInCat.CategoryId;
                }
             

            }

            if(invoice != null)
            {

                var prod = new ProductInInvoice
                {
                    InvoiceId = invoiceId,
                    ProdName = prodName,
                    Price = price,
                    QTY = qty,
                    Total = total,
                    CategoryId = catId,
                    ProductId = productId
                };

                db.ProductInInvoices.InsertOnSubmit(prod);
                db.SubmitChanges();

                return true;

            }
            else
            {
                return false;
            }

        }


        public int? AddInvoice(int customerId, decimal totalAmount)
        {

            var customer = (from c in db.Customers
                            where c.CustomerId == customerId
                            select c).FirstOrDefault();

            if(customer != null)
            {

                var newInvoice = new Invoice2
                {
                    CustomerId = customerId,
                    InvoiceDate = DateTime.Now,
                    TotalAmount = totalAmount
                };

                db.Invoice2s.InsertOnSubmit(newInvoice);
                db.SubmitChanges();

                return newInvoice.InvoiceId;

            }
            else
            {
                return null;
            }

        }


        public bool PurchaseProdsInCart(int customerId)
        {

            dynamic prodIC = (from pic in db.ProductInCarts
                           where pic.CustomerId == customerId
                           select pic).DefaultIfEmpty();

            foreach(ProductInCart pic in prodIC)
            {

                if (pic != null)
                {
                    //Get product
                    cProduct prod = GetProduct(pic.ProductId);

                    //Get the new number in stock
                    int newNumInStock = prod.NumInStock - pic.Quantity;

                    //Change the number sold
                    ChangeSales(prod.ProductId, pic.Quantity);

                    //Change the number in stock
                    EditProduct(pic.ProductId, prod.ProdName, (decimal)prod.Price, prod.ProdDescription, prod.ProdIngredients, prod.ProductDirections, prod.Storage, newNumInStock, prod.ImageURL);


                    //Remove the product from the cart
                    RemoveProductInCart(customerId, pic.ProductId);
                }
                else
                {
                    return false;
                }

            }

            return true;

        }


        private bool ChangeSales(int productId, int numSold)
        {

            //Get the sales tracker for product
            var sProd = (from p in db.SoldProducts
                         where p.ProductId == productId
                         select p).FirstOrDefault();

            if(sProd != null)
            {

                //Get the new number of sales
                int newNumSold = sProd.Sales + numSold;

                //Save the value
                sProd.Sales = newNumSold;
                db.SubmitChanges();

                return true;

            }
            else
            {
                return false;
            }

        }


        public bool DeleteProduct(int productId)
        {
            var product = db.Products.FirstOrDefault(p => p.ProductId == productId);
            if (product != null)
            {
                //Delete all dependancies first
                //Find all Products in all the customer carts
                dynamic pics = (from p in db.ProductInCarts
                           where p.ProductId == product.ProductId
                           select p).DefaultIfEmpty();
                if(pics != null)
                {
                    foreach(ProductInCart pic in pics)
                    {
                        if(pic != null)
                        {
                            db.ProductInCarts.DeleteOnSubmit(pic);
                        }
                    }
                }

                //Find all Products in sales table
                var sProd = (from p in db.SoldProducts
                             where p.ProductId == product.ProductId
                             select p).FirstOrDefault();
                if(sProd != null)
                {
                    db.SoldProducts.DeleteOnSubmit(sProd);
                }

                //Find all products in recipes
                dynamic pirs = (from p in db.ProductInRecipes
                               where p.ProductId == product.ProductId
                               select p).DefaultIfEmpty();
                if(pirs != null)
                {
                    foreach (ProductInRecipe pir in pirs)
                    {
                        if (pir != null)
                        {
                            db.ProductInRecipes.DeleteOnSubmit(pir);
                        }
                    }
                }

                //Find all products in categories
                dynamic piCats = (from p in db.ProductInCatergories
                                  where p.ProductId == product.ProductId
                                  select p).DefaultIfEmpty();
                if (piCats != null)
                {
                    foreach (ProductInCatergory piCat in piCats)
                    {
                        if (piCat != null)
                        {
                            db.ProductInCatergories.DeleteOnSubmit(piCat);
                        }
                    }
                }

                //Delete the product
                db.Products.DeleteOnSubmit(product);
                db.SubmitChanges();
                return true;
            }
            return false;
        }


        public ReportData GetReportData()
        {

            //Get all the products
            List<cProduct> prods = GetProducts();

            //Count the number of products
            int numProds = prods.Count;

            //Calculate the total revenue
            decimal revenue = CalculateRevenue();

            //Get all the product categories
            List<cCategory> cats = GetCategories();

            //Count the number of categories
            int numCats = cats.Count;

            //Get the number of registered users
            int numUsers = GetNumUsers();

            var reportData = new ReportData
            {

                NumProducts = numProds,
                TotalRevenue = revenue,
                NumCategories = numCats,
                NumUsers = numUsers

            };

            return reportData;

        }

        private decimal CalculateRevenue()
        {

            decimal revenue = 0;

            //Get all the invoices
            dynamic invs = db.Invoice2s.DefaultIfEmpty();

            //Sum up the totals
            foreach(Invoice2 i in invs)
            {
                
                if(i != null)
                {
                    decimal total = i.TotalAmount + (i.TotalAmount * 0.15m);
                    revenue += total;
                }

            }

            return revenue;

        }


        private int GetNumUsers()
        {

            //Get a list of users
            dynamic users = db.Users.DefaultIfEmpty();

            int numUsers = 0;

            //Count the number of users
            foreach(User u in db.Users)
            {

                if(u != null)
                {

                    numUsers += 1;

                }

            }

            return numUsers;

        }


        public List<CategoryRevenue> GetCategoryRevenues()
        {

            //Get all categories
            List<cCategory> cats = GetCategories();

            List<CategoryRevenue> result = new List<CategoryRevenue>();

            //Go through all the categories and get all the revenues
            foreach(cCategory c in cats)
            {
                //Get the name
                string catName = c.CategoryName;

                //Get all the products in invoice from category
                dynamic prods = (from p in db.ProductInInvoices
                                 where p.CategoryId == c.CategoryId
                                 select p).DefaultIfEmpty();

                //sum up all the revenue
                decimal revenue = 0;
                foreach(ProductInInvoice p in prods)
                {

                    if(p != null)
                    {
                        revenue += p.Total;
                    }

                }

                //save the information and add to list
                CategoryRevenue newCR = new CategoryRevenue
                {

                    name = catName,
                    value = revenue

                };

                result.Add(newCR);

            }

            return result;

        }


        public List<ProductSales> GetTop5Products()
        {

            dynamic sProds = db.SoldProducts.DefaultIfEmpty();

            List<ProductSales> lProds = new List<ProductSales>();
            List<ProductSales> top5 = new List<ProductSales>();

            if(sProds != null)
            {

                foreach(SoldProduct p in sProds)
                {
                    if(p != null)
                    {
                        var prod = (from pr in db.Products
                                    where pr.ProductId == p.ProductId
                                    select pr).FirstOrDefault();

                        if(prod != null)
                        {

                            //Create sendable version
                            var tempProd = new ProductSales
                            {
                                ProductId = p.ProductId,
                                ProductName = prod.ProdName,
                                NumSold = p.Sales
                            };

                            lProds.Add(tempProd);

                        }

                    }
                }

                //sort and take out the top 5
                top5 = lProds.OrderByDescending(p => p.NumSold).Take(5).ToList();

            }

            return top5;

        }


        public int? GetFitnessGoalId(int cusId)
        {
            var cus = db.Customers.FirstOrDefault(c => c.CustomerId == cusId);

            if (cus == null)
            {
                return 0;
            }
            else
            {
                var fId = cus.FitnessGoal;
                return fId;
            }
        }


        private cFitnessGoal ConvToSendableGoal(FitnessGoal f)
        {

            var goalToSend = new cFitnessGoal
            {
                FitnessGoalId = f.FitnessGoalId,
                FGoalName = f.FGoalName
            };

            return goalToSend;

        }





    }
}
