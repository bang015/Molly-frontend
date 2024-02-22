import React, { useState, ChangeEvent, useEffect } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import IconButton from "@mui/material/IconButton";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import TextField from "@mui/material/TextField";
import "./index.css";
import { Avatar, Button, Modal } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux";
import getCroppedImg, { getCropSize } from "../../../Utils/image-crop";
import { postType, updatePostType, uploadPostType } from "../../../Interfaces/post";
import { updatePost, uploadPost } from "../../../Redux/post";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
interface PostModalProps {
  postConfig: boolean;
  setPostConfig: React.Dispatch<React.SetStateAction<boolean>>;
  openModal: () => void;
  post: postType | null;
}
const PostForm: React.FC<PostModalProps> = ({
  postConfig,
  setPostConfig,
  openModal,
  post,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.authReducer.user);
  const token = useSelector((state: RootState) => state.authReducer.token);
  const [showImages, setShowImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [croppedAreaList, setCroppedAreaList] = useState<Area[]>([]);
  const [postContent, setPostContent] = useState<string>("");
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    if(post){
      const content = post.content.replace(/<br>/g, '\n').replace(/<span style="color: rgb\(0, 55, 107\);">#([^<]+)<\/span>/g, '#$1');
      setPostContent(content);
    }
  }, [post, postConfig]);
  const handleCloseModal = () => {
    setPostConfig(false);
    setShowImages([]);
    setCurrentImageIndex(0);
    setPostContent("");
    setCroppedAreaList([]);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
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
              const imageRatio = 7 / 7;
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
    if (post) {
      if (currentImageIndex < post.mediaList.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    } else {
      if (currentImageIndex < showImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      }
    }
  };
  const onPrevClick = () => {
    if (post) {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      }
    } else {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
        setZoom(1);
      }
    }
  };
  const handlePostContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const Content = e.target.value;
    setPostContent(Content);
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
    const matches = postContent.match(regex);
    const content = postContent.replace(/\n/g, "<br>").replace(
      /#([^\s]+)/g,
      '<span style="color: rgb(0, 55, 107);">#$1</span>'
    );
    let post: uploadPostType = {
      content: content,
      post_images: croppedImgList,
    };
    if (matches) {
      const tags = matches.map((match) => match.replace(/^#/, ""));
      post.hashtags = tags;
    }
    if(token)
    dispatch(uploadPost({ post, token }) as any);
    openModal();
    handleCloseModal();
  };
  const handleUpdatePost = async() => {
    const regex = /#([a-zA-Z0-9가-힣_]+)/g;
    const matches = postContent.match(regex);
    const content = postContent.replace(/\n/g, "<br>").replace(
      /#([^\s]+)/g,
      '<span style="color: rgb(0, 55, 107);">#$1</span>'
    );
    if(post){
      let postInfo: updatePostType = {
        content: content,
        postId: post.id.toString()
      };
      if (matches) {
        const tags = matches.map((match) => match.replace(/^#/, ""));
        postInfo.hashtags = tags;
      }
      if(token)
      dispatch(updatePost({postInfo, token}) as any);
      setPostConfig(false);
    }
  }
  return (
    <div>
      <Modal
        open={postConfig}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="create-post">
          <div className="create-post-title">
            {post ? "게시물 수정" : "새 게시물 만들기"}
            <Button
              disabled={post? false : (postContent === "" || showImages.length === 0)}
              className="post-btn"
              onClick={post ? handleUpdatePost:handleuploadPost}
            >
              완료
            </Button>
          </div>
          <div className="create-post-container">
            <div className="create-post-content">
                {post ? (
                  <div className="pmedia">
                    {currentImageIndex > 0 && (
                      <div className="c-back-btn">
                        <IconButton
                          aria-label="fingerprint"
                          color="secondary"
                          style={{
                            backgroundColor: "rgba(255, 255, 255, 0.5)",
                          }}
                          onClick={onPrevClick}
                        >
                          <ChevronLeftIcon style={{ color: "black" }} />
                        </IconButton>
                      </div>
                    )}
                    {post &&
                      post.mediaList &&
                      post.mediaList.length > 1 &&
                      currentImageIndex < post.mediaList.length - 1 && (
                        <div className="c-next-btn">
                          <IconButton
                            aria-label="fingerprint"
                            color="secondary"
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.5)",
                            }}
                            onClick={onNextClick}
                          >
                            <NavigateNextIcon style={{ color: "black" }} />
                          </IconButton>
                        </div>
                      )}
                    <div>
                      <div
                        className="medias-wrapper"
                        style={{
                          transform: `translateX(-${currentImageIndex * 100}%)`,
                        }}
                      >
                        {post.mediaList.map((media, index) => (
                          <img key={index} src={media.mediaPath} alt="img" />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {showImages.length === 0 ? (
                      <div className="create-post-text">
                        <label htmlFor="fileInput">
                          <div className="ipicon">
                            <ImageSearchIcon sx={{ fontSize: 100 }} />
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
                          aspect={7 / 7}
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
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.5)",
                            }}
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
                  </>
                )}
            </div>
            <div className="post-text">
              <div>
                {user && (
                  <div className="cpuf">
                    <div className="pi">
                      <Avatar
                        alt="profile"
                        src={
                          user.ProfileImage
                            ? user.ProfileImage.path ?? undefined
                            : undefined
                        }
                      />
                    </div>
                    <div className="uf unts">{user.nickname}</div>
                  </div>
                )}

                <div>
                  <TextField
                    variant="standard"
                    className="post-textField"
                    placeholder="문구를 입력하세요..."
                    value={postContent}
                    rows={6}
                    multiline
                    onChange={handlePostContent}
                    InputProps={{
                      style: { padding: 10 },
                      disableUnderline: true,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostForm;
