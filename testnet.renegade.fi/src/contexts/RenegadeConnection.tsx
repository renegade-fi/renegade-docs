import React from "react";

import RenegadeConnection from "../connections/RenegadeConnection";

type RenegadeConnectionContextType = [
  RenegadeConnection,
  React.Dispatch<React.SetStateAction<RenegadeConnection>>,
];
const RenegadeConnectionContext =
  React.createContext<RenegadeConnectionContextType>([
    RenegadeConnection.default(),
    () => null,
  ]);
export default RenegadeConnectionContext;
