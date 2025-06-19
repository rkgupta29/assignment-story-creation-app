import { create } from "zustand";
import { ReactNode } from "react";
import NonVerifiedUserModal from "@/components/modals/NonVerifiedUserModal";
import { useAuthStoreWithInit } from "./auth-store";
import ProfileIncompleteModal from "@/components/modals/ProfileIncompleteModal";

type BaseModalType = "verification" | false;

type CandidateModalType =
  | BaseModalType
  | "profile-incomplete"
  | "resume-missing";

type OrganizationModalType =
  | BaseModalType
  | "subscription-expired"
  | "company-profile-incomplete";

type ModalType = CandidateModalType | OrganizationModalType;

interface BaseModalState<T> {
  activeModal: T;
  invokeModal: (type: T) => void;
  closeModal: () => void;
}

interface ModalState {
  activeModal: ModalType;
  invokeModal: (type: ModalType) => void;
  closeModal: () => void;
}

// Type guards for modal types
const isCandidateModalType = (type: ModalType): type is CandidateModalType => {
  return (
    type === "verification" ||
    type === "profile-incomplete" ||
    type === "resume-missing" ||
    type === false
  );
};

const isOrganizationModalType = (
  type: ModalType
): type is OrganizationModalType => {
  return (
    type === "verification" ||
    type === "subscription-expired" ||
    type === "company-profile-incomplete" ||
    type === false
  );
};

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
  const { userProfile, loading } = useAuthStoreWithInit();
  const store = useModalStore();

  console.log("User Profile:", userProfile);
  console.log("User Type:", userProfile?.userType);
  console.log("Loading:", loading);

  // If still loading, return a generic type that allows all modals
  if (loading || !userProfile) {
    return {
      ...store,
      invokeModal: (type: ModalType) => store.invokeModal(type),
    } as BaseModalState<ModalType>;
  }

  // Based on user type, return the appropriate typed store
  if (userProfile.userType === "candidate") {
    return {
      ...store,
      invokeModal: (type: CandidateModalType) => {
        if (isCandidateModalType(type)) {
          store.invokeModal(type);
        } else {
          console.error("Invalid modal type for candidate:", type);
        }
      },
    } as BaseModalState<CandidateModalType>;
  }

  if (userProfile.userType === "organization") {
    return {
      ...store,
      invokeModal: (type: OrganizationModalType) => {
        if (isOrganizationModalType(type)) {
          store.invokeModal(type);
        } else {
          console.error("Invalid modal type for organization:", type);
        }
      },
    } as BaseModalState<OrganizationModalType>;
  }

  // Fallback to generic type if user type is unknown
  return {
    ...store,
    invokeModal: (type: ModalType) => store.invokeModal(type),
  } as BaseModalState<ModalType>;
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
