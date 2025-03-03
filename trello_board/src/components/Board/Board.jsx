import { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
// import { useSnackbar } from "react-simple-snackbar";

import styles from "./Board.module.css";
import { List } from "../List/List";
import { AddFeatureComp } from "../Add_Feature_Comp/AddFeatureComp";
import { OnClickEditor } from "../On_Click_Editor/OnClickEditor";
import { addList, moveCard, updateListTitle, resetBoard } from "../../redux/boardSlice";

const Board = () => {
  const dispatch = useDispatch();
  const boardData = useSelector((state) => state.board);
 // const { lists, modal, } = boardData;
  const [loading, setLoading] = useState(true);
  //const [openSnackbar] = useSnackbar({ position: "top-center" });

  useEffect(() => {
    setLoading(false);
  }, []);

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

  const handleAddList = () => {
    if (text.trim().length > 0) {
      dispatch(addList(text));
      setText("");
      hanldeOpenTextEditor();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (editName !== "") {
        dispatch(updateListTitle({ listId: "board", title: editName })); // "board" id is temporary
      }
      handleOpenEditorName();
      setEditName("");
    }
  };

  const handleDragEnd = (data) => {
    const { source, destination, draggableId } = data;
    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    dispatch(
        moveCard({
          sourceListId: source.droppableId,
          destinationListId: destination.droppableId,
          cardId: draggableId,
          destinationIndex: destination.index,
        })
    );
  };

  const handleResetBoard = () => {
    dispatch(resetBoard());
  };

  return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className={styles.container}>
          {loading ? (
              <div className="loading_indicator">Loading...</div>
          ) : (
              <>
                <button onClick={handleResetBoard}>Reset Board</button>
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
                      {boardData.lists.length > 0 ? "My Board" : "Empty Board"}
                    </div>
                )}
                <div className={styles.list_container}>
                  {lists?.map((list, i) => (
                      <List key={list.id} list={list} list_index={i} />
                  ))}
                  <div className={styles.add_feature_comp_container}>
                    {openTextEditor ? (
                        <AddFeatureComp
                            text={text}
                            setText={setText}
                            hanldeOpenTextEditor={hanldeOpenTextEditor}
                            handleAdd={handleAddList}
                        />
                    ) : (
                        <button
                            className={styles.add_list_btn}
                            onClick={hanldeOpenTextEditor}
                        >
                          Add list
                        </button>
                    )}
                  </div>
                </div>
              </>
          )}
        </div>
      </DragDropContext>
  );
};

export { Board };
