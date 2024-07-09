import { RootState } from "@/redux";
import { useDispatch, useSelector } from "react-redux";
import DeleteModal from "../delete";

const MODAL_TYPES = {
  DeleteModal: "DeleteModal",
};

// const MODAL_COMPONENTS = [
//   {
//     type: MODAL_TYPES.DeleteModal,
//     component: <DeleteModal />,
//   },
// ];

const GlobalModal: React.FC = () => {
  const { modalType, isOpen } = useSelector((state:RootState) => state.modalReducer);
  const dispatch = useDispatch();
  if (!isOpen) return;
  return (
    <></>
  )
}