using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;

namespace Back_End
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the interface name "IService1" in both code and config file together.
    [ServiceContract]
    public interface IService1
    {

        [OperationContract]
        [WebGet(UriTemplate = "/Login?email={email}&password={password}", ResponseFormat = WebMessageFormat.Json)]
        cUser Login(string email, string password);

        [OperationContract]
        [WebGet(UriTemplate = "/RegisterUser?firstName={firstName}&surname={surname}&email={email}&password={password}&userType={userType}&fGoal={fGoal}", ResponseFormat = WebMessageFormat.Json)]
        bool RegisterUser(string firstName, string surname, string email, string password, string userType, int fGoal);

        [OperationContract]
        [WebGet(UriTemplate = "/GetProduct?productId={productId}", ResponseFormat = WebMessageFormat.Json)]
        cProduct GetProduct(int productId);

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetProducts")]
        List<cProduct> GetProducts();

        [OperationContract]
        [WebGet(UriTemplate = "/AddProduct?prodName={prodName}&price={price}&prodDescription={prodDescription}&prodIngredients={prodIngredients}&prodDirections={prodDirections}&storage={storage}&numInStock={numInStock}&imageURL={imageURL}", ResponseFormat = WebMessageFormat.Json)]
        bool AddProduct(string prodName, decimal price, string prodDescription, string prodIngredients, string prodDirections, string storage, int numInStock, string imageURL);

        [OperationContract]
        [WebGet(UriTemplate = "/EditProduct?productId={productId}&prodName={prodName}&price={price}&prodDescription={prodDescription}&prodIngredients={prodIngredients}&prodDirections={prodDirections}&storage={storage}&numInStock={numInStock}&imageURL={imageURL}", ResponseFormat = WebMessageFormat.Json)]
        bool EditProduct(int productId, string prodName, decimal price, string prodDescription, string prodIngredients, string prodDirections, string storage, int numInStock, string imageURL);

        [OperationContract]
        [WebGet(UriTemplate = "/GetProductsInCart?customerId={customerId}", ResponseFormat = WebMessageFormat.Json)]
        List<cProductInCart> GetProductsInCart(int customerId);

        [OperationContract]
        [WebGet(UriTemplate = "/AddProductInCart?customerId={customerId}&productId={productId}&quantity={quantity}", ResponseFormat = WebMessageFormat.Json)]
        bool AddProductInCart(int customerId, int productId, int quantity);

        [OperationContract]
        [WebGet(UriTemplate = "/RemoveProductInCart?customerId={customerId}&productId={productId}", ResponseFormat = WebMessageFormat.Json)]
        bool RemoveProductInCart(int customerId, int productId);

        [OperationContract]
        [WebGet(UriTemplate = "/EditProductInCart?customerId={customerId}&productId={productId}&quantity={quantity}", ResponseFormat = WebMessageFormat.Json)]
        bool EditProductInCart(int customerId, int productId, int quantity);

        [OperationContract]
        [WebGet(UriTemplate = "/GetProductInCart?customerId={customerId}&productId={productId}", ResponseFormat = WebMessageFormat.Json)]
        cProductInCart GetProductInCart(int customerId, int productId);

        [OperationContract]
        List<ProductRating> GetProductRatings(int productId);

        [OperationContract]
        [WebGet(ResponseFormat = WebMessageFormat.Json, UriTemplate = "/GetCategories")]
        List<cCategory> GetCategories();

        [OperationContract]
        [WebGet(UriTemplate = "/GetCategory?categoryId={categoryId}", ResponseFormat = WebMessageFormat.Json)]
        cCategory GetCategory(int categoryId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetProductsInCategory?categoryId={categoryId}", ResponseFormat = WebMessageFormat.Json)]
        List<cProduct> GetProductsInCategory(int categoryId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetRecipes", ResponseFormat = WebMessageFormat.Json)]
        List<Recipe> GetRecipes();

        [OperationContract]
        [WebGet(UriTemplate = "/GetRecipe?recipeId={recipeId}", ResponseFormat = WebMessageFormat.Json)]
        Recipe GetRecipe(int recipeId);

        [OperationContract]
        [WebGet(UriTemplate = "/EditRecipe?recipeId={recipeId}&recipeName={recipeName}&recipeDescription={recipeDescription}&recipeInstructions={recipeInstructions}&recipeIngredients={recipeIngredients}&recipeImage={recipeImage}", ResponseFormat = WebMessageFormat.Json)]
        bool EditRecipe(int recipeId, string recipeName, string recipeDescription, string recipeInstructions, string recipeIngredients, string recipeImage);

        [OperationContract]
        [WebGet(UriTemplate = "/DeleteRecipe?recipeId={recipeId}", ResponseFormat = WebMessageFormat.Json)]
        bool DeleteRecipe(int recipeId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetProductsInRecipe?recipeId={recipeId}", ResponseFormat = WebMessageFormat.Json)]
        List<cProduct> GetProductsInRecipe(int recipeId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetFitnessGoals", ResponseFormat = WebMessageFormat.Json)]
        List<cFitnessGoal> GetFitnessGoals();


        [OperationContract]
        FitnessGoal GetFitnessGoal(int fitnessGoalId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetRecipesInGoal?fitnessGoalId={fitnessGoalId}", ResponseFormat = WebMessageFormat.Json)]
        List<Recipe> GetRecipesInGoal(int fitnessGoalId);


        [OperationContract]
        List<Product> GetProductsInGoal(int fitnessGoalId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetInvoices?customerId={customerId}", ResponseFormat = WebMessageFormat.Json)]
        List<cInvoice> GetInvoices(int customerId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetInvoice?invoiceId={invoiceId}", ResponseFormat = WebMessageFormat.Json)]
        cInvoice GetInvoice(int invoiceId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetProductsInInvoice?invoiceId={invoiceId}", ResponseFormat = WebMessageFormat.Json)]
        List<ProductInInvoice> GetProductsInInvoice(int invoiceId);

        [OperationContract]
        [WebGet(UriTemplate = "/AddProductInInvoice?invoiceId={invoiceId}&productId={productId}&prodName={prodName}&price={price}&qty={qty}&total={total}", ResponseFormat = WebMessageFormat.Json)]
        bool AddProductInInvoice(int invoiceId, int productId, string prodName, decimal price, int qty, decimal total);

        [OperationContract]
        [WebGet(UriTemplate = "/AddInvoice?customerId={customerId}&totalAmount={totalAmount}", ResponseFormat = WebMessageFormat.Json)]
        int? AddInvoice(int customerId, decimal totalAmount);

        [OperationContract]
        [WebGet(UriTemplate = "/PurchaseProdsInCart?customerId={customerId}", ResponseFormat = WebMessageFormat.Json)]
        bool PurchaseProdsInCart(int customerId);

        [OperationContract]
        [WebGet(UriTemplate = "/DeleteProduct?productId={productId}", ResponseFormat = WebMessageFormat.Json)]
        bool DeleteProduct(int productId);

        [OperationContract]
        [WebGet(UriTemplate = "/GetReportData", ResponseFormat = WebMessageFormat.Json)]
        ReportData GetReportData();

        [OperationContract]
        [WebGet(UriTemplate = "/GetCategoryRevenues", ResponseFormat = WebMessageFormat.Json)]
        List<CategoryRevenue> GetCategoryRevenues();

        [OperationContract]
        [WebGet(UriTemplate = "/GetTop5Products", ResponseFormat = WebMessageFormat.Json)]
        List<ProductSales> GetTop5Products();

        [OperationContract]
        [WebGet(UriTemplate = "/GetFitnessGoalId?cusId={cusId}", ResponseFormat = WebMessageFormat.Json)]
        int? GetFitnessGoalId(int cusId);

        [OperationContract]
        [WebGet(UriTemplate = "/AddRecipe?recipeName={recipeName}&recipeDescription={recipeDescription}&recipeInstructions={recipeInstructions}&recipeIngredients={recipeIngredients}&recipeImage={recipeImage}", ResponseFormat = WebMessageFormat.Json)]
        bool AddRecipe(string recipeName, string recipeDescription, string recipeInstructions, string recipeIngredients, string recipeImage);

    }
}
