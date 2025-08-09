CREATE TABLE [dbo].[ProductInRecipe] (
    [ProductId] INT NOT NULL,
    [RecipeId]  INT NOT NULL,
    PRIMARY KEY CLUSTERED ([ProductId] ASC, [RecipeId] ASC),
    FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([ProductId]),
	FOREIGN KEY (RecipeId) REFERENCES [dbo].[Recipe](RecipeId)
);

