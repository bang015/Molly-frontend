import React from "react";
import { CircularProgress, Modal } from "@mui/material";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { closeModal } from "@/redux/modal";

const PostLoading: React.FC = () => {
  const dispatch = useDispatch();
  const {posting, message} = useSelector((state: RootState) => state.postReducer);
  const {isOpen} = useSelector((state:RootState) => state.modalReducer);
  return (
    <div>
      <Modal open={isOpen} onClose={()=>{dispatch(closeModal())}}>
        <div className="plmc">
          <div className="create-post-title">
            {posting ? "게시물을 공유중입니다." : message}
          </div>
          <div className="plod">
            {posting ? (
              <CircularProgress size={100} />
            ) : (
              <div>
                <div className="ipicon">
                  <CheckCircleOutlineIcon sx={{ fontSize: 100 }} />
                </div>
                <div>{message}</div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostLoading;
