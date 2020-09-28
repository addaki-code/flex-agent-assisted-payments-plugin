import { combineReducers } from "redux";

import { reduce as PaymentActions } from "./PaymentActions";

// Register your redux store under a unique namespace
export const namespace = "flex-payments";

// Combine the reducers
export default combineReducers({
    paymentContainerState: PaymentActions,
});