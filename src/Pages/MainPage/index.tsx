import React, { useState, useEffect, ChangeEvent } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import internal from "stream";

const Main: React.FC = () => {
  console.log(localStorage.getItem("token"));
  const navigate = useNavigate();
  const [postConfig, setPostConfig] = useState(false);
  const [showImages, setShowImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const handleCloseModal = () => {
    setPostConfig(false);
    setShowImages([]);
  };
  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };
  const handleAddImages = (e: ChangeEvent<HTMLInputElement>) => {
    const imageLists = e.target.files;
    let imageUrlLists: string[] = [...showImages];

    if (imageLists) {
      for (let i = 0; i < imageLists.length; i++) {
        const currentImageUrl = URL.createObjectURL(imageLists[i]);
        imageUrlLists.push(currentImageUrl);
      }
      if (imageUrlLists.length > 10) {
        imageUrlLists = imageUrlLists.slice(0, 10);
      }
      setShowImages(imageUrlLists); // 변환된 이미지 URL 목록을 상태로 업데이트
    }
  };

  return (
    <div className="mainPage">
      <div className="main-left">
        <div onClick={() => {}}>
          <div>Home</div>
        </div>
        <div onClick={() => {}}>
          <div>Search</div>
        </div>
        <div onClick={() => {}}>
          <div>Explore</div>
        </div>
        <div onClick={() => {}}>
          <div>Clip</div>
        </div>
        <div onClick={() => {}}>
          <div>Messages</div>
        </div>
        <div onClick={() => {}}>
          <div>Notifications</div>
        </div>
        <div
          onClick={() => {
            setPostConfig(true);
          }}
        >
          <div>Post</div>
        </div>
        {postConfig && (
          <div className="modal" onClick={handleCloseModal}>
            <div className="create-post" onClick={handleModalClick}>
              <div className="create-post-title">새 게시물 만들기</div>

              <div className="create-post-content">
                {showImages.length === 0 ? (
                  <div className="create-post-text">
                    <label htmlFor="fileInput">
                      <div>
                        <img
                          className="upload-icon"
                          src="/images/upload-icon.jpg"
                          width="250px"
                          alt="molly Logo"
                        />
                      </div>
                      당신의 추억을 업로드하세요!
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleAddImages}
                      multiple
                    />
                  </div>
                ) : (
                  <div>
                    {showImages.map((image, id) => (
                      <div className="upload-img" key={id}>
                        <img src={image} alt={`${image}-${id}`}/>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="main-center"></div>
      <div className="main-right"></div>
    </div>
  );
};

export default Main;
