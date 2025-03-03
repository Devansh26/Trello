import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    lists: JSON.parse(localStorage.getItem('boardData')) || [],
    modal: {
        isOpen: false,
        card: null,
    },
};

const saveToLocalStorage = (state) => {
    localStorage.setItem('boardData', JSON.stringify(state.lists));
};

const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
        addList: (state, action) => {
            state.lists.push({
                id: Date.now().toString(),
                title: action.payload,
                cards: [],
            });
            saveToLocalStorage(state);
        },
        deleteList: (state, action) => {
            state.lists = state.lists.filter((list) => list.id !== action.payload);
            saveToLocalStorage(state);
        },
        updateListTitle: (state, action) => {
            const { listId, title } = action.payload;
            const list = state.lists.find((list) => list.id === listId);
            if (list) {
                list.title = title;
                saveToLocalStorage(state);
            }
        },
        addCard: (state, action) => {
            const { listId, cardTitle } = action.payload;
            const list = state.lists.find((list) => list.id === listId);
            if (list) {
                list.cards.push({
                    id: Date.now().toString(),
                    title:cardTitle,
                    description: '',
                    dueDate: '',
                });
                saveToLocalStorage(state);
            }
        },
        deleteCard: (state, action) => {
            const { listId, cardId } = action.payload;
            const list = state.lists.find((list) => list.id === listId);
            if (list) {
                list.cards = list.cards.filter((card) => card.id !== cardId);
                saveToLocalStorage(state);
            }
        },
        moveCard: (state, action) => {
            console.log("Move Card Action:", action.payload);
            console.log("State Before Move:", JSON.parse(JSON.stringify(state)));
            const { sourceListId, destinationListId, cardId, destinationIndex } = action.payload;
            const sourceList = state.lists.find((list) => list.id === sourceListId);
            const destinationList = state.lists.find((list) => list.id === destinationListId);

            if (sourceList && destinationList) {
                const movedCardIndex = sourceList.cards.findIndex((card) => card.id === cardId);
                const [movedCard] = sourceList.cards.splice(movedCardIndex, 1);

                destinationList.cards.splice(destinationIndex, 0, movedCard);

                saveToLocalStorage(state);
            }

            console.log("State After Move:", JSON.parse(JSON.stringify(state)));
        },
        resetBoard: (state) => {
            state.lists = [];
            localStorage.removeItem('boardData');
        },
        openModal: (state, action) => {
            state.modal.isOpen = true;
            state.modal.card = action.payload;
        },
        closeModal: (state) => {
            state.modal.isOpen = false;
            state.modal.card = null;
        },
        updateCard: (state, action) => {
            const { listId, cardId, title, description, dueDate } = action.payload;
            const list = state.lists.find((list) => list.id === listId);
            if (list) {
                const card = list.cards.find((card) => card.id === cardId);
                if (card) {
                    card.title = title;
                    card.description = description;
                    card.dueDate = dueDate;
                    saveToLocalStorage(state);
                }
            }
        },
    },
});

export const { addList, deleteList, updateListTitle, addCard, deleteCard, moveCard, resetBoard, openModal, closeModal, updateCard } = boardSlice.actions;
export default boardSlice.reducer;
