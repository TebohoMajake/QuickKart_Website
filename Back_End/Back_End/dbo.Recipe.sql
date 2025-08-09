CREATE TABLE [dbo].[Recipe]
(
	[RecipeId] INT NOT NULL IDENTITY(1, 1) UNIQUE,
	[RecipeName] VARCHAR(MAX) NOT NULL,
	[RecipeDescription] VARCHAR(MAX) NOT NULL,
	[RecipeInstructions] VARCHAR(MAX) NOT NULL,

	PRIMARY KEY(RecipeId)
)
