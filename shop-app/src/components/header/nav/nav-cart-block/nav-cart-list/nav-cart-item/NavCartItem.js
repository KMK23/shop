import React from "react";
import styles from "./NavCartItem.module.scss";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteCartItem,
  deleteFromCart,
} from "../../../../../../store/cart/cartSlice";
import { collection } from "firebase/firestore";
import userSlice from "./../../../../../../store/user/userSlice";

function NavCartItem({ product }) {
  const dispatch = useDispatch();
  const { uid, isAuthenticated } = useSelector((state) => state.userSlice);
  const deleteProduct = () => {
    if (isAuthenticated) {
      dispatch(
        deleteCartItem({
          collectionName: `users/${uid}/cart/`,
          productId: product.docId,
        })
      );
    } else {
      dispatch(deleteFromCart(product.id));
    }
  };
  return (
    <div className={styles.nav_cart_item}>
      <Link>
        <img src={product.image} />
      </Link>
      <div className={styles.nav_cart_description}>
        <h3>{product.category}</h3>
        <h2>{product.title}</h2>
        <span>{`${product.price} X ${
          product.quantity
        } = $${product.total.toFixed(2)}`}</span>
        {/* 소수점 두번째 자리까지 나오게 하는것 ex) 59.00 이렇게  */}
      </div>
      <button className={styles.nav_cart_delete} onClick={deleteProduct}>
        <AiOutlineDelete />
      </button>
    </div>
  );
}

export default NavCartItem;
