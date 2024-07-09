import React from "react";
import { CircularProgress, Modal } from "@mui/material";
import "./index.css";
import { useSelector } from "react-redux";
import { RootState } from "@/redux";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
interface postLoadingProps {
  open: boolean;
  onClose: () => void;
}
const PostLoading: React.FC<postLoadingProps> = ({ open, onClose }) => {
  const loading = useSelector((state: RootState) => state.postReducer.posting);
  const message = useSelector((state: RootState) => state.postReducer.message);
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="plmc">
          <div className="create-post-title">
            {loading ? "게시물을 공유중입니다." : message}
          </div>
          <div className="plod">
            {loading ? (
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
