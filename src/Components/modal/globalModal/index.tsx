import { RootState } from "@/redux";
import { useSelector } from "react-redux";
import DeleteModal from "../delete";
import PostActionModal from "../post";
import PostForm from "@/components/post/postForm";
import PostLoading from "@/components/post/postLoading";
import PostDetail from "@/components/post/postDetail";

const MODAL_TYPES = {
  DeleteModal: "DeleteModal",
  PostActionModal: "PostActionModal",
  PostFormModal: "PostFormModal",
  PostingModal: "PostingModal",
  PostDetailModal: "PostDetailModal"
};
const MODAL_COMPONENTS = [
  {
    type: MODAL_TYPES.DeleteModal,
    component: <DeleteModal />,
  },
  {
    type: MODAL_TYPES.PostActionModal,
    component: <PostActionModal />,
  },
  {
    type: MODAL_TYPES.PostFormModal,
    component: <PostForm />,
  },
  {
    type: MODAL_TYPES.PostingModal,
    component: <PostLoading />,
  },
  {
    type: MODAL_TYPES.PostDetailModal,
    component: <PostDetail />,
  },
];

const GlobalModal: React.FC = () => {
  const { modalType, isOpen } = useSelector(
    (state: RootState) => state.modalReducer
  );

  if (!isOpen) return;
  const findModal = MODAL_COMPONENTS.find((modal) => {
    return modal.type === modalType;
  });
  const renderModal = () => {
    return findModal?.component;
  };
  return <div>{renderModal()}</div>;
};
export default GlobalModal;
