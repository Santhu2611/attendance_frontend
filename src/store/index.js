import React from "react";
import UserStore from "./user_store";
import CommonStore from "./common_store";
import VerificationStore from "./verification_store";
import AccessStore from "./access_store";

class RootStore {
  constructor() {
    this.UserStore = new UserStore(this);
    this.CommonStore = new CommonStore(this);
    this.VerificationStore = new VerificationStore(this);
    this.AccessStore = new AccessStore(this);
  }
}

const StoresContext = React.createContext(new RootStore());
export const useStores = () => React.useContext(StoresContext);
