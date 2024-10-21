import React, { useEffect } from "react";
import styles from "./NavCartList.module.scss";
import NavCartItem from "./nav-cart-item/NavCartItem";
import { useDispatch, useSelector } from "react-redux";
import productSlice from "./../../../../../store/products/productSlice";
import cartSlice from "./../../../../../store/cart/cartSlice";

function NavCartList(props) {
  const { products } = useSelector((state) => state.cartSlice);
  const dispatch = useDispatch();

  return (
    <div className={styles.nav_cart_list}>
      {products.map((product, idx) => {
        return <NavCartItem product={product} key={idx} />;
      })}
    </div>
  );
}

export default NavCartList;
