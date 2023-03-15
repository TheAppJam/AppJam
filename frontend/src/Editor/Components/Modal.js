import React, { useEffect, useState } from "react";
import { default as ReactModal } from "react-bootstrap/Modal";
import Container from "../Container";

const Modal = ({
  id,
  order=[],
  appDefinition,
  componentsLength,
  appOrderChanged,
  setExposedVariable,
  exposedVariables,
  ...props
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    setExposedVariable('show', show);
  }, [show])

  useEffect(() => {
    const canShowModal = exposedVariables.show ?? false;
    if (canShowModal !== setShow) {
      setShow(canShowModal)
    }
  }, [exposedVariables.show]);

  return (
    <div>
      <ReactModal
        container={document.getElementsByClassName('fixed-canvas')[0]}
        centered
        size="sm"
        show={show}
        keyboard={true}
        onHide={handleClose}
        enforceFocus={false}
        >
        <ReactModal.Body>
        <Container
            {...props}
            itemType="containerdragbox"
            parentAppOrderChanged={(boxes) => {
              appOrderChanged(id, boxes);
            }
            }
            order={order}
            definition={appDefinition}
            componentsLength={componentsLength}
          />
        </ReactModal.Body>
      </ReactModal>
    </div>
  );
};

export default Modal;
