import React from "react";
import styles from "./CartItem.module.scss";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateTotalAndQuantity,
  decrementProduct,
  deleteCartItem,
  deleteFromCart,
  incrementProduct,
  removeFromCart,
} from "../../../../store/cart/cartSlice";

import userSlice from "./../../../../store/user/userSlice";

function CartItem({ product }) {
  const dispatch = useDispatch();
  const { isAuthenticated, uid } = useSelector((state) => state.userSlice);
  const deleteProduct = () => {
    if (isAuthenticated) {
      dispatch(
        // deleteCartItem({
        //   collectionName: ["users", uid, "cart"],
        //   productId: product.id,
        // })
        deleteCartItem({
          collectionName: `users/${uid}/cart/`,
          productId: product.id,
        })
      );
    } else {
      dispatch(deleteFromCart(product.id));
    }
  };

  const incrementCount = () => {
    if (isAuthenticated) {
      dispatch(
        calculateTotalAndQuantity({
          uid,
          productId: product.id,
          operator: "increment",
        })
      );
    } else {
      dispatch(incrementProduct(product.id));
    }
  };
  const decrementCount = () => {
    if (isAuthenticated) {
      dispatch(
        calculateTotalAndQuantity({
          uid,
          productId: product.id,
          operator: "decrement",
        })
      );
    } else {
      dispatch(decrementProduct(product.id));
    }
  };

  return (
    <div className={styles.cart_item}>
      <Link>
        <img src={product.image} />
      </Link>
      <div className={styles.cart_description}>
        <h3>{product.category}</h3>
        <h2>{product.title}</h2>
        <span>{`${product.price} X ${
          product.quantity
        } = $${product.total.toFixed(2)}`}</span>
        {/* 소수점 두번째 자리까지 나오게 하는것 ex) 59.00 이렇게  */}
      </div>
      <div className={styles.cart_count}>
        <div>
          <button disabled={product.quantity === 1} onClick={decrementCount}>
            -
          </button>
          <span>{product.quantity}</span>
          <button disabled={product.quantity === 10} onClick={incrementCount}>
            +
          </button>
        </div>
      </div>
      <button className={styles.cart_delete} onClick={deleteProduct}>
        <AiOutlineDelete />
      </button>
    </div>
  );
}

export default CartItem;
