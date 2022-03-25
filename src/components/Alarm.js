import React from "react";
import RoundTab from "./RoundTab";
import TableList from "./TableList";

const Alarm = () => {
  const tabRef = React.useRef();
  const [currTab, setCurrTab] = React.useState("total");

  return (
    <div>
      <h2></h2>
      <RoundTab currTab={setCurrTab} />
      <TableList currTab={currTab} />
    </div>
  );
};

export default Alarm;
