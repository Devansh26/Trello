import { useState, useRef, useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
// import { useSnackbar } from "react-simple-snackbar";

import styles from "./List.module.css";
import { Card } from "../Card/Card";
import { AddFeatureComp } from "../Add_Feature_Comp/AddFeatureComp";
import { OnClickEditor } from "../On_Click_Editor/OnClickEditor";
import { addCard, updateListTitle } from "../../redux/boardSlice";

const List = ({ list, list_index }) => {
  const dispatch = useDispatch();
  const { cards, id, title } = list;
  //const [openSnackbar] = useSnackbar({ position: "top-center" });

  const [text, setText] = useState("");
  const [openTextEditor, setOpenTextEditor] = useState(false);
  const [editName, setEditName] = useState("");
  const [openEditName, setOpenEditName] = useState(false);
  const input_ref = useRef();

  useEffect(() => {
    if (openEditName) {
      input_ref.current.focus();
    }
  }, [openEditName]);

  const hanldeOpenTextEditor = () => {
    setOpenTextEditor(!openTextEditor);
  };

  const handleOpenEditorName = () => {
    setOpenEditName(!openEditName);
  };

  const handleAddCard = () => {
    if (text.trim().length > 0) {
      dispatch(addCard({ listId: id, cardTitle: text }));
      setText("");
      hanldeOpenTextEditor();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (editName !== "") {
        dispatch(updateListTitle({ listId: id, title: editName }));
      }
      handleOpenEditorName();
      setEditName("");
    }
  };

  return (
      <div className={styles.container}>
        {openEditName ? (
            <div className={styles.header}>
              <OnClickEditor
                  editName={editName}
                  setEditName={setEditName}
                  handleOpenEditorName={handleOpenEditorName}
                  handleKeyDown={handleKeyDown}
                  input_ref={input_ref}
              />
            </div>
        ) : (
            <div onClick={handleOpenEditorName} className={styles.header}>
              {title}
            </div>
        )}
        <div className={styles.card_container}>
          <Droppable droppableId={id}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {cards.length === 0 && (
                      <div className={styles.card_container_empty}></div>
                  )}
                  {cards?.map((card, i) => (
                      <Card
                          key={card.id}
                          card={card}
                          list_index={list_index}
                          card_index={i}
                      />
                  ))}
                  {provided.placeholder}
                </div>
            )}
          </Droppable>
          {openTextEditor ? (
              <AddFeatureComp
                  text={text}
                  setText={setText}
                  hanldeOpenTextEditor={hanldeOpenTextEditor}
                  handleAdd={handleAddCard}
              />
          ) : (
              <button
                  className={styles.add_card_btn}
                  onClick={hanldeOpenTextEditor}
              >
                Add card
              </button>
          )}
        </div>
      </div>
  );
};

export { List };
