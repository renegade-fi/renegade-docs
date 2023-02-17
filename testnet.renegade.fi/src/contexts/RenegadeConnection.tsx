import React from "react";

import RenegadeConnection from "../connections/RenegadeConnection";

type RenegadeConnectionContextType = RenegadeConnection;
const RenegadeConnectionContext =
  React.createContext<RenegadeConnectionContextType>(
    RenegadeConnection.default(),
  );
export default RenegadeConnectionContext;
