"use client";

import { useContext, useState, createContext } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <ModalContext.Provider value={{ isOpen, closeModal, openModal }}>
            {children}
        </ModalContext.Provider>
    )
}

export function useModal() {
    return useContext(ModalContext);
}