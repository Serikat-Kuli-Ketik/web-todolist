import { useState } from "react";
import Modal from "react-modal";
import useSwr from "swr";
import { APIResponse, TaskLabel } from "../shared/types";
import { swrFetcher } from "../utils";
import { Loading } from "./loading";
import styled from "styled-components";
import Color from "color";
import { Plus, X } from "tabler-icons-react";

type Props = {
  isOpen: boolean;
  onSelect: (label: TaskLabel) => void;
  onClose: () => void;
};

export const LabelSelectorModal: React.FC<Props> = (props) => {
  const { data, isLoading, error } = useSwr<APIResponse<TaskLabel[]>>(
    `${process.env.NEXT_PUBLIC_API_URL}/labels`,
    swrFetcher
  );

  const [searchTerm, setSearchTerm] = useState("");

  const displayedLabels = data?.data.filter((label) => {
    if (searchTerm === "") return true;
    return label.title.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) return <Loading />;
  if (error) return <h1>Error fetching labels, try again in a moment.</h1>;

  return (
    <Modal isOpen={props.isOpen} style={modalStyles}>
      <ModalHeaderContainer>
        <ModalTitle>Label Selector</ModalTitle>
        <X id="close-modal-btn" cursor={"pointer"} onClick={props.onClose} />
      </ModalHeaderContainer>

      {displayedLabels ? (
        <>
          <LabelSearchContainer>
            <LabelSearch
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Labels"
            />
            <Plus className="new-label-btn" />
          </LabelSearchContainer>

          <LabelListContainer>
            {displayedLabels.map((label, key) => (
              <LabelOption
                key={key}
                onClick={() => props.onSelect(label)}
                bgColor={label.color}
                textColor={Color(label.color).isLight() ? "black" : "white"}
              >
                {label.title}
              </LabelOption>
            ))}
          </LabelListContainer>
        </>
      ) : null}
    </Modal>
  );
};

const modalStyles: Modal.Styles = {
  content: {
    height: "300px",
    width: "300px",
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
  font-size: 1.5rem;
`;

const LabelSearchContainer = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 90% 10%;

  .new-label-btn {
    margin: 5px;
    padding: 3px;
    cursor: pointer;
    border-radius: 6px;

    :hover {
      background-color: lightgrey;
    }
  }
`;

const LabelSearch = styled.input`
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid grey;
`;

const LabelListContainer = styled.ul`
  max-height: 250px;
  overflow-y: scroll;
`;

type OptionProps = {
  bgColor: string;
  textColor: string;
};

const LabelOption = styled.li<OptionProps>`
  padding: 5px 10px;
  margin: 5px;
  border-radius: 4px;
  background-color: ${(prop) => prop.bgColor};
  color: ${(prop) => prop.textColor};
  font-size: 0.9rem;
  cursor: pointer;
`;
