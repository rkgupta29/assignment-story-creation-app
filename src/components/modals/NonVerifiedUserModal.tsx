import { useModalStore } from "@/stores/modal-store";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

export default function NonVerifiedUserModal() {
  const { closeModal } = useModalStore();
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Non Verified User</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p>You are not verified. Please verify your account to continue.</p>
        </DialogDescription>
        <DialogFooter>
          <Button onClick={closeModal}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
