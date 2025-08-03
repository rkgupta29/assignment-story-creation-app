import { create } from "zustand";
import { ReactNode } from "react";
import NonVerifiedUserModal from "@/components/modals/NonVerifiedUserModal";
import { useAuthStoreWithInit } from "./auth-store";
import ProfileIncompleteModal from "@/components/modals/ProfileIncompleteModal";

type ModalType = "verification" | "profile-incomplete" | false;

interface ModalState {
  activeModal: ModalType;
  invokeModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: false,
  invokeModal: (type) => {
    set({ activeModal: type });
  },
  closeModal: () => {
    set({ activeModal: false });
  },
}));

export const useTypedModalStore = () => {
  const { user, loading } = useAuthStoreWithInit();
  const store = useModalStore();

  // If still loading, return a generic type that allows all modals
  if (loading || !user) {
    return {
      ...store,
      invokeModal: (modalType: ModalType) => store.invokeModal(modalType),
    };
  }

  // For a stories application, all authenticated users have the same modal access
  return {
    ...store,
    invokeModal: (modalType: ModalType) => store.invokeModal(modalType),
  };
};

export const ModalWrapper = ({ children }: { children: ReactNode }) => {
  const { activeModal } = useTypedModalStore();

  return (
    <>
      {children}
      {activeModal === "verification" && <NonVerifiedUserModal />}
      {activeModal === "profile-incomplete" && <ProfileIncompleteModal />}
    </>
  );
};
