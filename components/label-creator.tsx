import { useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { X } from "tabler-icons-react";
import { SketchPicker } from "react-color";
import Color from "color";
import { toast } from "react-toastify";
import { mutate } from "swr";

type Props = {
  isOpen: boolean;
  // Determine whether to automatically close the modal when finished creating the label or not.
  // Defaults to true.
  autoClose?: boolean;
  onClose: () => void;
};

export const LabelCreatorModal: React.FC<Props> = (props) => {
  const { isOpen, autoClose = true, onClose } = props;

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#f5f5f5");

  const handleCreateNewLabel = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/labels`, {
      method: "POST",
      body: JSON.stringify({ title, color }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      toast("Failed creating new label, try again in a moment.", {
        type: "error",
      });

      return;
    }

    setTitle("");
    toast("Success creating new label.", { type: "success" });
    mutate(`${process.env.NEXT_PUBLIC_API_URL}/labels`);
    if (autoClose) onClose();
  };

  return (
    <Modal isOpen={isOpen} style={modalStyles}>
      <ModalHeaderContainer>
        <ModalTitle>Create new label</ModalTitle>
        <X id="close-modal-btn" cursor="pointer" onClick={onClose} />
      </ModalHeaderContainer>

      <LabelPreview bgColor={color}>
        <LabelTitle
          textColor={Color(color).isLight() ? "black" : "white"}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title here"
        />
      </LabelPreview>

      <ColorPickerContainer>
        <SketchPicker
          color={color}
          onChange={(color) => setColor(color.hex)}
          onChangeComplete={(color) => setColor(color.hex)}
        />
      </ColorPickerContainer>

      <SaveBtn onClick={handleCreateNewLabel}>Save</SaveBtn>
    </Modal>
  );
};

const modalStyles: Modal.Styles = {
  content: {
    height: "570px",
    width: "400px",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
  },
};

const ModalHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid grey;
`;

const ModalTitle = styled.h1`
  font-size: 1rem;
`;

const LabelPreview = styled.div<{ bgColor: string }>`
  min-width: 120px;
  min-height: 80px;
  border-radius: 12px;
  background-color: ${(prop) => prop.bgColor};
  position: relative;
  margin: 10px 0;
  border: 0.5px solid lightgrey;
`;

type LabelTitleProps = {
  textColor: string;
};

const LabelTitle = styled.input<LabelTitleProps>`
  background-color: transparent;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 10px;
  color: ${(prop) => prop.textColor};
  border: none;
  text-align: center;
  font-size: 1rem;
  letter-spacing: 1px;

  :active {
    border: none;
  }
`;

const ColorPickerContainer = styled.div`
  margin: 0 auto;
`;

const SaveBtn = styled.button`
  padding: 10px 15px;
  margin: 20px 0;
  border-radius: 8px;
  border: 1px solid lightgrey;
  cursor: pointer;
  background-color: black;
  color: white;
  transition: all 0.1s;

  :active {
    transform: scale(0.97);
  }
`;
