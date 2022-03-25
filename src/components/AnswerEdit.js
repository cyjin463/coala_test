import React from "react";
import Answer from "./Answer";

const AnswerEdit = ({ uid, isEdit }) => {
  const [isOpen, setIsOpen] = React.useState(isEdit);
  console.log(isEdit);
  React.useEffect(() => {
    setIsOpen(isEdit);
  }, [isEdit]);

  return <div>{isOpen === uid && <Answer isEdit={true} />}</div>;
};

export default AnswerEdit;
