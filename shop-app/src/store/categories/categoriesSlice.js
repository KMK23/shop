import { createSlice } from "@reduxjs/toolkit";
import { CategoriesName } from "./categories";
const initialState = CategoriesName.All;

const categoriesSlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setActiveCategory: (state, action) => {
      return (state = action.payload);
      //   단일값일때는 return 을 써주어야한다.
    },
  },
});

export default categoriesSlice.reducer;
export const { setActiveCategory } = categoriesSlice.actions;
