import React, { useState, useEffect, ChangeEvent } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TextField from "@mui/material/TextField";
import "./index.css";
import { Avatar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import getCroppedImg, { getCropSize } from "../../../Utils/image-crop";
import { uploadPostType } from "../../../Interfaces/post";
import { uploadPost } from "../../../Redux/post";
interface PostModalProps {
  postConfig: boolean;
  setPostConfig: React.Dispatch<React.SetStateAction<boolean>>;
}

const PostForm: React.FC<PostModalProps> = ({ postConfig, setPostConfig }) => {
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [showImages, setShowImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [croppedAreaList, setCroppedAreaList] = useState<Area[]>([]);
  const [postcontent, setPostContent] = useState<string>("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const handleCloseModal = () => {
    setPostConfig(false);
    setShowImages([]);
    setCurrentImageIndex(0);
    setPostContent("");
    setCroppedAreaList([]);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const handleAddImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList) {
      let newMediaList: string[] = [...showImages];
      let newCroppedAreas: Area[] = [...croppedAreaList];
      for (let i = 0; i < fileList.length; i++) {
        const currentFile = fileList[i];

        if (currentFile.type.startsWith("image/")) {
          const imageUrl = URL.createObjectURL(currentFile);
          newMediaList.push(imageUrl);

          const image = new Image();
          image.src = imageUrl;

          await new Promise((resolve) => {
            image.onload = () => {
              resolve(null);
              const originalImageWidth = image.width;
              const originalImageHeight = image.height;
              const imageRatio = 8 / 7;
              const cropSize = getCropSize(
                originalImageWidth,
                originalImageHeight,
                originalImageWidth,
                originalImageHeight,
                imageRatio
              );
              const areaCropSize = {
                width: cropSize.width,
                height: cropSize.height,
                x: 0,
                y: 0,
              };
              newCroppedAreas.push(areaCropSize);
            };
          });
        } else if (currentFile.type.startsWith("video/")) {
          const videoUrl = URL.createObjectURL(currentFile);
          newMediaList.push(videoUrl);
        }
      }

      if (newMediaList.length > 5) {
        newMediaList = newMediaList.slice(0, 5);
      }

      setShowImages(newMediaList);
      setCroppedAreaList(newCroppedAreas);
    }
  };
  const onCropComplete = (croppedAreaPixels: Area, croppedArea: Area) => {
    const updatedCroppedAreas = [...croppedAreaList];
    updatedCroppedAreas[currentImageIndex] = croppedArea;
    setCroppedAreaList(updatedCroppedAreas);
  };
  const onNextClick = (): void => {
    if (currentImageIndex < showImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };
  const onPrevClick = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setZoom(1);
    }
  };
  const handlePostContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const postContent = e.target.value;
    setPostContent(postContent);
  };
  const handleuploadPost = async () => {
    let croppedImgList: Blob[] = [];

    for (let i = 0; i < showImages.length; i++) {
      try {
        const croppedImage = await getCroppedImg(
          showImages[i],
          croppedAreaList[i]
        );
        if (croppedImage) {
          croppedImgList.push(croppedImage);
        }
      } catch (e) {
        console.log(e);
      }
    }
    const regex = /#([a-zA-Z0-9가-힣_]+)/g;
    const matches = postcontent.match(regex);
    let postContent: uploadPostType = {
      token: token!,
      content: postcontent,
      post_images: croppedImgList,
    };
    if (matches) {
    const tags = matches.map(match => match.replace(/^#/, ''));
      postContent.hashtags = tags;
    }
    uploadPost(token!, postContent)
  };
  return (
    <div>
      {postConfig && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="create-post" onClick={handleModalClick}>
            <div className="create-post-title">
              새 게시물 만들기
              <Button
                disabled={postcontent === "" || showImages.length === 0}
                className="post-btn"
                onClick={handleuploadPost}
              >
                개시
              </Button>
            </div>
            <div className="create-post-container">
              <div className="create-post-content">
                {showImages.length === 0 ? (
                  <div className="create-post-text">
                    <label htmlFor="fileInput">
                      <div>
                        <img
                          className="upload-icon"
                          src="/images/upload-icon.jpg"
                          width="250px"
                          alt="upload"
                        />
                      </div>
                      당신의 추억을 업로드하세요!
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*,video/*"
                      onChange={handleAddImages}
                      multiple
                    />
                  </div>
                ) : (
                  <div className="post-image">
                    <Cropper
                      image={showImages[currentImageIndex]}
                      crop={crop}
                      zoom={zoom}
                      aspect={8 / 7}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      objectFit="cover"
                    />
                    {currentImageIndex > 0 && (
                      <IconButton
                        className="back-btn"
                        aria-label="fingerprint"
                        color="secondary"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                        onClick={onPrevClick}
                      >
                        <ChevronLeftIcon style={{ color: "black" }} />
                      </IconButton>
                    )}
                    {showImages.length > 1 &&
                      currentImageIndex < showImages.length - 1 && (
                        <IconButton
                          className="next-btn"
                          aria-label="fingerprint"
                          color="secondary"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                          }}
                          onClick={onNextClick}
                        >
                          <NavigateNextIcon style={{ color: "black" }} />
                        </IconButton>
                      )}
                  </div>
                )}
              </div>
              <div className="post-text">
                <div>
                  <div>
                    <Avatar alt="Remy Sharp" src={user?.ProfileImage?.path} />
                    {user?.nickname}
                  </div>
                  <div>
                    <TextField
                      variant="standard"
                      className="post-textField"
                      placeholder="문구를 입력하세요..."
                      rows={6}
                      multiline
                      onChange={handlePostContent}
                      InputProps={{
                        style: { padding: 10 },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostForm;
