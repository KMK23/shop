import React, { useEffect } from "react";
import CardItem from "./card-item/CardItem";
import styles from "./CardList.module.scss";
import { useDispatch, useSelector } from "react-redux";
import productsSlice, {
  fetchProducts,
} from "./../../../store/products/productsSlice";
import categoriesSlice from "./../../../store/categories/categoriesSlice";
import CardSkeleton from "./../card-skeleton/CardSkeleton";
import { getDatasRest } from "../../../API";
function CardList(props) {
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.productsSlice);
  const category = useSelector((state) => state.categoriesSlice);

  const handleLoad = async () => {
    const queryOptions = {
      conditions: [
        {
          field: "category",
          operator: category ? "EQUAL" : "GREATER_THAN_OR_EQUAL",
          value: category.toLowerCase(),
        },
      ],
    };
    const restResult = await getDatasRest("products", queryOptions);
  };
  // handleLoad는 확인용으로 만든것뿐 헷갈리지마

  useEffect(() => {
    const queryOptions = {
      conditions: [
        {
          field: "category",
          // operator: category ? "==" : ">=",
          operator: category ? "EQUAL" : "GREATER_THAN_OR_EQUAL",
          value: category.toLowerCase(),
        },
      ],
    };
    dispatch(fetchProducts({ collectionName: "products", queryOptions }));
    // handleLoad();
  }, [category]);

  if (isLoading) return <CardSkeleton />;

  return (
    <ul className={styles.card_list}>
      {products.map((product, idx) => {
        return <CardItem item={product} key={idx} />;
      })}
    </ul>
  );
}

export default CardList;
