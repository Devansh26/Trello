import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Home.module.css";
import { BoardCard } from "../Board_Card/BoardCard";
import { AddFeatureComp } from "../Add_Feature_Comp/AddFeatureComp";
import { addList } from "../../redux/boardSlice"; // Import the addList action
import { getItem } from "../../utilities/localStorage";

const Home = () => {
  const dispatch = useDispatch(); // Get the dispatch function
  const userBoards = useSelector((state) => state.board.lists); // Get the boards from Redux
  const history = useHistory();
  const user_details = getItem("user_details");
  const name = user_details && user_details.name ? user_details.name : "User";
  const [openSnackbar] = useSnackbar({ position: "top-center" });

  const handleNavigateToBoard = (boardId) => {
    history.push(`/board/${boardId}`);
  };

  const [text, setText] = useState("");
  const [openTextEditor, setOpenTextEditor] = useState(false);

  const hanldeOpenTextEditor = () => {
    setOpenTextEditor(!openTextEditor);
  };

  const handleAddBoard = () => {
    if (text.trim().length > 0) {
      dispatch(addList(text)); // Dispatch the addList action
      setText("");
      hanldeOpenTextEditor();
    }
  };

  return (
      <div className={styles.container}>
        <div className={styles.header}>{name}'s Boards</div>
        <div className={styles.board_cards_container}>
          {userBoards?.map((board) => (
              <BoardCard
                  key={board.id} // Use board.id
                  handleClick={handleNavigateToBoard}
                  name={board.title} // Use board.title
                  board_id={board.id} // Use board.id
              />
          ))}
          <div className={styles.add_feature_comp_container}>
            {openTextEditor ? (
                <AddFeatureComp
                    text={text}
                    setText={setText}
                    hanldeOpenTextEditor={hanldeOpenTextEditor}
                    handleAdd={handleAddBoard}
                />
            ) : (
                <button
                    className={styles.add_board_btn}
                    onClick={hanldeOpenTextEditor}
                >
                  Add Board
                </button>
            )}
          </div>
        </div>
      </div>
  );
};

export { Home };
