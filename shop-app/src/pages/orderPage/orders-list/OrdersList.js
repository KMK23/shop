import React, { useEffect } from "react";
import styles from "./OrdersList.module.scss";
import OrderItem from "./order-item/OrderItem";
import { getDatas } from "../../../firebase";
import { useDispatch, useSelector } from "react-redux";
import productsSlice from "./../../../store/products/productsSlice";
import orderMock from "../../../orderMock.json";
import { getISODate } from "../../../utils/getFormattedDate";
import { sendOrder } from "../../../store/cart/cartSlice";
import userSlice from "./../../../store/user/userSlice";
import CartEmpty from "./../../../components/cart-empty/CartEmpty";
import { fetchOrder } from "../../../store/order/orderSlice";

function OrdersList(props) {
  const { order } = useSelector((state) => state.orderSlice);
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(
      fetchOrder({ collection: ["users", uid, "order"], queryOptions: {} })
    );
  }, []);

  if (order.length === 0) return <CartEmpty />;

  return (
    <div className={styles.orders}>
      {order.map((order, idx) => (
        <div key={idx}>
          <div className={styles.order_header}>
            <h3>주문 번호_{order.createdAt}</h3>
            <h3>
              주문 날짜_{getISODate(order.createdAt).yyyyMMdd}{" "}
              {getISODate(order.createdAt).hhmmss}
            </h3>
            <p>합계 : ${order.totalPrice.toFixed(2)}</p>
          </div>
          <ul className={styles.orders_list}>
            {order.products.map((product) => (
              <OrderItem key={product.id} {...product} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default OrdersList;
