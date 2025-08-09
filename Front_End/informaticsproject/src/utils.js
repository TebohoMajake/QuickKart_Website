import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Function to handle adding a product to the cart
export const handleAddToCart = (productId, cartProducts, setCartProducts) => {
  const userId = localStorage.getItem("UserId");

  if (userId) {
    axios
      .get(
        `http://localhost:58398/Service1.svc/AddProductInCart?customerId=${userId}&productId=${productId}&quantity=1`
      )
      .then(() => {
        setCartProducts((prevCartProducts) => [
          ...prevCartProducts,
          { ProductId: productId, Quantity: 1 },
        ]);
      })
      .catch((error) => {
        console.error("Error adding the product to cart: ", error);
      });
  } else {
    let cart = localStorage.getItem("cart");
    let cartArray = cart ? JSON.parse(cart) : [];

    const existingProduct = cartArray.find(
      (item) => item.ProductId === productId
    );

    if (existingProduct) {
      existingProduct.Quantity += 1;
    } else {
      cartArray.push({ ProductId: productId, Quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartArray));
    setCartProducts(cartArray);
  }
};


// Function to merge local cart with server cart when user logs in
export const mergeLocalCartWithServerCart = async (setCartProducts) => {
    const userId = localStorage.getItem("UserId");
    const localCart = localStorage.getItem("cart");
  
    if (userId && localCart) {
      const cartArray = JSON.parse(localCart);
      
      // Iterate through local cart and try to add each item to the server cart
      for (const product of cartArray) {
        await axios
          .get(
            `http://localhost:58398/Service1.svc/AddProductInCart?customerId=${userId}&productId=${product.ProductId}&quantity=${product.Quantity}`
          )
          .then((response) => {
            // Check if the product already exists in the server cart
            if (response.data === false) {
              console.log(`Product with ID ${product.ProductId} already exists in the cart. Skipping...`);

              if (product.Quantity > 0) {
                const url = `http://localhost:58398/Service1.svc/EditProductInCart?customerId=${userId}&productId=${product.ProductId}&quantity=${product.Quantity}`;
          
                axios
                  .get(url)
                  .then(() => {
                    
                  })
                  .catch((error) => {
                    console.error("Error updating product in cart:", error);
                  });
              }

            } else {
              console.log(`Product with ID ${product.ProductId} added successfully.`);
            }
          })
          .catch((error) => {
            console.error(`Error merging product ${product.ProductId}:`, error);
          });
      }
  
      // After merging, clear local storage cart
      localStorage.removeItem("cart");
  
      // Optionally, fetch the updated server-side cart to refresh the UI
      axios
        .get(`http://localhost:58398/Service1.svc/GetUserCart?customerId=${userId}`)
        .then((response) => {
          setCartProducts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching updated server cart:", error);
        });
    }
  };


// Function to handle quantity changes in the cart
export const handleQuantityChange = (productId, numInStock, change, cartProducts, setCartProducts) => {
  const userId = localStorage.getItem("UserId");

  if (userId) {
    const currentProduct = cartProducts.find(
      (product) => product.ProductId === productId
    );
    
    if(currentProduct)
    {

      const newQuantity = currentProduct.Quantity + change;

    
    //console.log("Got here ", numInStock);
    if(newQuantity <= numInStock)
    {
      

      if (newQuantity > 0) {
        const url = `http://localhost:58398/Service1.svc/EditProductInCart?customerId=${userId}&productId=${productId}&quantity=${newQuantity}`;
  
        axios
          .get(url)
          .then(() => {
            setCartProducts((prevCartProducts) =>
              prevCartProducts.map((cartProduct) =>
                cartProduct.ProductId === productId
                  ? { ...cartProduct, Quantity: newQuantity }
                  : cartProduct
              )
            );

            
          })
          .catch((error) => {
            console.error("Error updating product in cart:", error);
          });

          
      }
      else
        {
          console.log('Got here');
          removeProductInCart(productId, cartProducts, setCartProducts);
    
        }

    }

    }

  } else {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedCart = cart
      .map((item) => {
        if (item.ProductId === productId) {
          const newQuantity = item.Quantity + change;
          if(newQuantity <= numInStock)
          {
            return newQuantity > 0 ? { ...item, Quantity: newQuantity } : null;
          }

        }
        return item;
      })
      .filter((item) => item != null);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartProducts(updatedCart);
  }
};

// Function to check if a product is in the cart
export const isInCart = (productId, cartProducts) => {
  return cartProducts.some(
    (cartProduct) => cartProduct.ProductId === productId
  );
};

// Function to get the quantity of a product in the cart
export const getProductQuantity = (productId, cartProducts) => {
  const product = cartProducts.find(
    (cartProduct) => cartProduct.ProductId === productId
  );
  return product ? product.Quantity : 0;
};


//Function to remove a product in cart
export const removeProductInCart = (productId, cartProduct, setCartProducts) => {

  const userId = localStorage.getItem("UserId");

  if(userId) {

    const url = `http://localhost:58398/Service1.svc/RemoveProductInCart?customerId=${userId}&productId=${productId}`;

    axios
      .get(url)
      .then((response) => {

        if(response === false)
        {

        }

      })
      .catch((error) => {
        console.error("Error removing product in cart:", error);
      });

      

  }
  else {

    const prodToRemove = cartProduct.find(item => item.ProductId === productId);
    const change = prodToRemove.Quantity - (2 * prodToRemove.Quantity);

    handleQuantityChange(productId, 0, change, cartProduct, setCartProducts);

  }
    
};


//Function to remove prodict in cart from the shopping cart page
export const removeProductInCart1 = (productId, cartProduct, setCartProducts) => {

  const userId = localStorage.getItem("UserId");

  if(userId) {

    const url = `http://localhost:58398/Service1.svc/RemoveProductInCart?customerId=${userId}&productId=${productId}`;

    axios
      .get(url)
      .then((response) => {

        if(response === false)
        {

        }

      })
      .catch((error) => {
        console.error("Error removing product in cart:", error);
      });

      

  }
  else {

    const prodToRemove = cartProduct.find(item => item.ProductId === productId);
    const change = prodToRemove.Quantity - (2 * prodToRemove.Quantity);

    handleQuantityChange1(productId, 0, change, cartProduct, setCartProducts);

  }
    
};


// Function to handle quantity changes in the cart for the shopping cart page
export const handleQuantityChange1 = (productId, numInStock, change, cartProducts, setCartProducts) => {
  const userId = localStorage.getItem("UserId");

  if (userId) {
    const currentProduct = cartProducts.find(
      (product) => product.ProductId === productId
    );
    const newQuantity = currentProduct.Quantity + change;

    if(newQuantity <= numInStock)
    {

      if (newQuantity > 0) {
        const url = `http://localhost:58398/Service1.svc/EditProductInCart?customerId=${userId}&productId=${productId}&quantity=${newQuantity}`;
  
        axios
          .get(url)
          .then(() => {
            setCartProducts((prevCartProducts) =>
              prevCartProducts.map((cartProduct) =>
                cartProduct.ProductId === productId
                  ? { ...cartProduct, Quantity: newQuantity }
                  : cartProduct
              )
            );
          })
          .catch((error) => {
            console.error("Error updating product in cart:", error);
          });
      }
      else
      {
        console.log('Got here');
        removeProductInCart1(productId, cartProducts, setCartProducts);
  
      }

    }
    else
    {
      console.log('Oops', numInStock);
    }


  } else {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedCart = cart
      .map((item) => {
        if (item.ProductId === productId) {
          const newQuantity = item.Quantity + change;
          return newQuantity > 0 && newQuantity <= numInStock ? { ...item, Quantity: newQuantity } : null;
        }
        return item;
      })
      .filter((item) => item != null);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    let cartToChange = cartProducts
      .map((item) => {

        if(item.ProductId === productId) {
          const newQuantity = item.Quantity + change;
          if(newQuantity <= numInStock)
          {
            return newQuantity > 0 ? { ...item, Quantity: newQuantity } : null;
          }
        }
        return item;

      })
      .filter((item) => item != null);

    setCartProducts(cartToChange);
  }
};