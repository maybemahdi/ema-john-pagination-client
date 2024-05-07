import React, { useEffect, useState } from "react";
import {
  addToDb,
  deleteShoppingCart,
  getShoppingCart,
} from "../../utilities/fakedb";
import Cart from "../Cart/Cart";
import Product from "../Product/Product";
import "./Shop.css";
import { Link, useLoaderData } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const cartData = useLoaderData();
    const [cart, setCart] = useState(cartData);
  const  [count, setCount]  = useState(0);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const numberOfPages = Math.ceil(count / itemPerPage);

  const pages = [...Array(numberOfPages).keys()];

  useEffect(() => {
    fetch(
      `http://localhost:5000/products?page=${
        currentPage - 1
      }&size=${itemPerPage}`
    )
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [currentPage, itemPerPage]);

  useEffect(() => {
    fetch("http://localhost:5000/productsCount")
    .then(res => res.json())
    .then(data => setCount(data.count))
  }, [])

//   useEffect(() => {
//     const storedCart = getShoppingCart();
//     const savedCart = [];
//     // step 1: get id of the addedProduct
//     for (const id in storedCart) {
//       // step 2: get product from products state by using id
//       const addedProduct = products.find((product) => product._id === id);
//       if (addedProduct) {
//         // step 3: add quantity
//         const quantity = storedCart[id];
//         addedProduct.quantity = quantity;
//         // step 4: add the added product to the saved cart
//         savedCart.push(addedProduct);
//       }
//       // console.log('added Product', addedProduct)
//     }
//     // step 5: set the cart
//     setCart(savedCart);
//   }, [products]);

  const handleAddToCart = (product) => {
    // cart.push(product); '
    let newCart = [];
    // const newCart = [...cart, product];
    // if product doesn't exist in the cart, then set quantity = 1
    // if exist update quantity by 1
    const exists = cart.find((pd) => pd._id === product._id);
    if (!exists) {
      product.quantity = 1;
      newCart = [...cart, product];
    } else {
      exists.quantity = exists.quantity + 1;
      const remaining = cart.filter((pd) => pd._id !== product._id);
      newCart = [...remaining, exists];
    }

    setCart(newCart);
    addToDb(product._id);
  };

  const handleClearCart = () => {
    setCart([]);
    deleteShoppingCart();
  };

  const handleItemPerPage = (e) => {
    const value = parseFloat(e.target.value);
    console.log(value);
    setItemPerPage(value);
    setCurrentPage(1);
  };
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="shop-container w-[90%] mx-auto my-10">
      <div className="products-container">
        {products.map((product) => (
          <Product
            key={product._id}
            product={product}
            handleAddToCart={handleAddToCart}
          ></Product>
        ))}
      </div>
      <div className="cart-container">
        <Cart cart={cart} handleClearCart={handleClearCart}>
          <Link className="proceed-link" to="/orders">
            <button className="btn-proceed">Review Order</button>
          </Link>
        </Cart>
      </div>
      <div className="mt-12 flex items-center justify-center gap-3">
        <div className="flex gap-3">
          {/* <p>Current page: {currentPage}</p> */}
          <button
            onClick={handlePrev}
            className="bg-slate-200 hover:bg-slate-300 text-black transition-all duration-500 px-4 py-1 rounded-sm"
          >
            Prev
          </button>
          {pages.map((page, idx) => (
            <button
              onClick={() => setCurrentPage(page + 1)}
              className={` ${
                currentPage === page + 1
                  ? "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-slate-200 hover:bg-slate-300 text-black"
              }  transition-all duration-500 px-4 py-1 rounded-sm`}
              key={idx}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            className="bg-slate-200 hover:bg-slate-300 text-black transition-all duration-500 px-4 py-1 rounded-sm"
          >
            Next
          </button>
        </div>
        <div>
          <select
            className="bg-green-400 hover:bg-green-500 transition-all duration-500 text-black px-3 py-1 rounded-sm"
            value={itemPerPage}
            name=""
            id=""
            onChange={handleItemPerPage}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Shop;
