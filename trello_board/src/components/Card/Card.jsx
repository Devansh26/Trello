import { useState, useRef, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { FaRegEdit } from "react-icons/fa";
import Modal from "react-modal";

import styles from "./Card.module.css";
import { updateCard } from "../../redux/boardSlice";
import { OnClickEditor } from "../On_Click_Editor/OnClickEditor";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
  },
};

const Card = ({ card, list_index, card_index }) => {
  const dispatch = useDispatch();
  const { id, title, description } = card;
  const [openSnackbar] = useSnackbar({ position: "top-center" });

  const [modelOpen, setModalOpen] = useState(false);
  const [modalState, setModalState] = useState({ title, description });
  const [editName, setEditName] = useState("");
  const [openEditName, setOpenEditName] = useState(false);
  const input_ref = useRef();

  useEffect(() => {
    if (openEditName) {
      input_ref.current.focus();
    }
  }, [openEditName]);

  const hanldeModalState = (e) => {
    setModalState({ ...modalState, [e.target.name]: e.target.value });
  };

  const hanldeModalOpen = () => {
    setModalOpen(true);
  };

  const hanldeModalClose = () => {
    setModalState({ title, description });
    setModalOpen(false);
  };

  useEffect(() => {
    setModalState({ title, description });
  }, [title, description]);

  const handleUpdate = () => {
    if (modalState.title !== "") {
      dispatch(
          updateCard({
            listId: list_index, // Assuming listId is the index
            cardId: id,
            title: modalState.title,
            description: modalState.description,
          })
      );
      hanldeModalClose();
    } else {
      openSnackbar("Card name cannot be empty");
    }
  };

  const handleOpenEditorName = () => {
    setOpenEditName(!openEditName);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (editName !== "") {
        dispatch(
            updateCard({
              listId: list_index, // Assuming listId is the index
              cardId: id,
              title: editName,
              description: description,
            })
        );
      }
      handleOpenEditorName();
      setEditName("");
    }
  };

  return (
      <>
        <Draggable draggableId={id} index={card_index}>
          {(provided) => (
              <div
                  ref={provided.innerRef}
                  {...provided.dragHandleProps}
                  {...provided.draggableProps}
                  className={styles.container}
              >
                {openEditName ? (
                    <OnClickEditor
                        editName={editName}
                        setEditName={setEditName}
                        handleOpenEditorName={handleOpenEditorName}
                        handleKeyDown={handleKeyDown}
                        input_ref={input_ref}
                    />
                ) : (
                    <>
                      <div className={styles.inner_container}>
                        <div
                            className={styles.card_name}
                            onClick={handleOpenEditorName}
                        >
                          {title}
                        </div>
                        <div
                            className={styles.card_edit_btn}
                            onClick={hanldeModalOpen}
                        >
                          <FaRegEdit />
                        </div>
                      </div>
                      {description && (
                          <div className={styles.card_description}>{description}</div>
                      )}
                    </>
                )}
              </div>
          )}
        </Draggable>
        <Modal
            isOpen={modelOpen}
            onRequestClose={hanldeModalClose}
            style={modalStyles}
            ariaHideApp={false}
        >
          <div className={styles.modal_header}>Edit Card</div>
          <div className={styles.modal_container}>
            <div className={styles.modal_container_items}>
              <div className={styles.modal_container_item_label}>Name</div>
              <input
                  name="title"
                  value={modalState.title}
                  onChange={hanldeModalState}
              />
            </div>
            <div className={styles.modal_container_items}>
              <div className={styles.modal_container_item_label}>Description</div>
              <textarea
                  name="description"
                  value={modalState.description}
                  onChange={hanldeModalState}
              />
            </div>
            <button
                className={styles.modal_container_ok_btn}
                onClick={handleUpdate}
            >
              Update
            </button>
            <button
                className={styles.modal_container_cancel_btn}
                onClick={hanldeModalClose}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </>
  );
};

export { Card };
