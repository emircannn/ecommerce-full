import { create } from "zustand";

interface QuestionModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useQuestionModal = create<QuestionModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
}));

export default useQuestionModal;