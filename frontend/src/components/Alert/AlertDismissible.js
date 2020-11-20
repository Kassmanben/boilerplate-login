import React, { useState } from "react";
import Alert from "react-bootstrap/Alert";

function AlertDismissible(props) {
  const [show, setShow] = useState({ ...props.show });
  React.useEffect(() => {
    setShow(props.show);
  }, [props.show]);
  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        {props.message}
      </Alert>
    );
  } else {
    return null;
  }
}

export default AlertDismissible;
