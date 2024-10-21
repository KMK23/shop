import React from "react";
import styles from "./CountProducts.module.scss";
import { useSelector } from "react-redux";
import productsSlice from "./../../../store/products/productsSlice";

function CountProducts(props) {
  const { products } = useSelector((state) => state.productsSlice);

  return (
    <div className={styles.count_Products}>
      <p>Showing : {products.length} items</p>
    </div>
  );
}

export default CountProducts;
