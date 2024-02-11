import { Modal } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux";
interface EditDeleteModalProps {
  userId: number;
  onClose: ()=>void;
}
const EditDeleteModal: React.FC<EditDeleteModalProps>= (
  {userId,
  onClose}
) => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  console.log(onClose);
  return (
    <div>
      <Modal
        open={userId !== null}
        onClose={onClose}
      >
        <div>

        </div>
      </Modal>
    </div>
  )
}

export default EditDeleteModal;