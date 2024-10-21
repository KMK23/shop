import React, { useEffect } from "react";
import styles from "./Checkout.module.scss";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import cartSlice, {
  getTotalPrice,
  postOrder,
} from "./../../../store/cart/cartSlice";
import userSlice from "./../../../store/user/userSlice";

function Checkout(props) {
  const { totalPrice, products } = useSelector((state) => state.cartSlice);
  const { isAuthenticated, uid } = useSelector((state) => state.userSlice);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getTotalPrice());
  }, []);

  const sendOrder = () => {
    const orderObj = {
      totalPrice,
      products,
    };
    dispatch(postOrder({ uid, cart: orderObj }));
    console.log(orderObj);
  };
  return (
    <div className={styles.checkout}>
      <div>
        <p>
          <span>합계: $ {totalPrice.toFixed(2)}</span>
        </p>
        {isAuthenticated ? (
          <button className={styles.checkout_button} onClick={sendOrder}>
            계산하기
          </button>
        ) : (
          <Link className={styles.checkout_button} to={"/login"}>
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}

export default Checkout;
