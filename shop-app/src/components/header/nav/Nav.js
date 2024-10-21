import React from "react";
import styles from "./Nav.module.scss";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiUser, FiLogIn } from "react-icons/fi";
import { GoSignOut } from "react-icons/go";
import NavCartBlock from "./nav-cart-block/NavCartBlock";
import { useDispatch, useSelector } from "react-redux";
import userSlice, { removeUser } from "./../../../store/user/userSlice";
import { signOut } from "firebase/auth";
import { getUserAuth } from "../../../firebase";

function Nav(props) {
  const { products } = useSelector((state) => state.cartSlice);
  const { isAuthenticated } = useSelector((state) => state.userSlice);
  const auth = getUserAuth();
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      dispatch(removeUser());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <div className={styles.counter}>
            <Link to={"/cart"}>
              <FiShoppingCart />
            </Link>
            {products.length > 0 && <b>{products.length}</b>}
            {products.length > 0 && (
              <div className={styles.nav_hover_cart}>
                <NavCartBlock />
              </div>
            )}
          </div>
        </li>
        <li>
          <div>
            <Link to={"/order"}>
              <FiUser />
            </Link>
          </div>
        </li>
        <li>
          {isAuthenticated ? (
            <div>
              <GoSignOut
                title="로그아웃"
                onClick={handleSignOut}
                className={styles.nav_sign_out}
              />
            </div>
          ) : (
            <div>
              <Link to={"/login"}>
                <FiLogIn title="로그인" />
              </Link>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
