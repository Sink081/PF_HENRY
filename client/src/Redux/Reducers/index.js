import productReducer from "./productReducer";
import userReducer from "./userReducer";
import productsReducer from "./productsReducer";
import { combineReducers } from "redux";
import tradesReducer from "./tradesReducer";
import categoriesReducer from "./categoriesReducer";

const allReducers = combineReducers({
	product: productReducer,
	products: productsReducer,
	users: userReducer,
	trades: tradesReducer,
	categories: categoriesReducer,
});

export default allReducers;
