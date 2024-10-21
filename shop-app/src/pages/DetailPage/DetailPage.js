import React, { useEffect } from "react";
import styles from "./DetailPage.module.scss";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import productSlice, {
  fetchProduct,
} from "./../../store/products/productSlice";
import cartSlice from "../../store/cart/cartSlice";
import productsSlice from "./../../store/products/productsSlice";

function DetailPage(props) {
  const { id } = useParams();
  // const productId = Number(id);
  const dispatch = useDispatch();
  const { product, isLoading } = useSelector((state) => state.productSlice);
  const { products } = useSelector((state) => state.productsSlice);
  // console.log(product);
  const productMatching = products.some((cartItem) => cartItem.docId === id);

  useEffect(() => {
    // const queryOptions = {
    //   conditions: [{ field: "id", operator: "==", value: productId }],
    // };
    // dispatch(fetchProduct({ collectionName: "products", queryOptions }));
    dispatch(fetchProduct({ collectionName: `/products/${id}` }));
  }, []);

  return (
    <div className="page">
      {isLoading ? (
        "Loading..."
      ) : (
        <div className={styles.card_wrapper}>
          <div className={styles.card_img}>
            <img src={product?.image} />
          </div>
          <div className={styles.card_description}>
            <h3>{product?.category}</h3>
            <h1>{product?.title}</h1>
            <h4>{product?.price}</h4>
            <p>{product?.description}</p>
            <div>
              <button disabled={productMatching}>
                {productMatching ? "장바구니에 담긴 제품" : "장바구니에 담기"}{" "}
              </button>
              <Link>장바구니로 이동</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailPage;
