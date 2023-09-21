import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { demoReducer } from "@/pages/Demo/store";

// 客户端store
const clientStore = configureStore({
  reducer: { demo: demoReducer.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

// 服务端store
const serverStore = configureStore({
  reducer: { demo: demoReducer.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export { clientStore, serverStore };