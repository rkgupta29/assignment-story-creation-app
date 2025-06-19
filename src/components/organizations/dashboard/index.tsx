import { useModalStore } from "@/stores/modal-store";
import React from "react";

export default function OrganizationDashboard() {
  const { invokeModal } = useModalStore();
  return (
    <button onClick={() => invokeModal("company-profile-incomplete")}>
      Open Profile Incomplete Modal
    </button>
  );
}
