import React, { useState, ChangeEvent, useEffect } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import IconButton from '@mui/material/IconButton'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import TextField from '@mui/material/TextField'
import { Avatar, Button, Modal } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux'
import getCroppedImg, { initializeImage } from '@/utils/image-crop'
import { MediaListType, updatePostType, uploadPostType } from '@/interfaces/post'
import { updatePost, uploadPost } from '@/redux/post'
import ImageSearchIcon from '@mui/icons-material/ImageSearch'
import { getSearchResult, resetResult } from '@/redux/search'
import { closeSubModal, openModal } from '@/redux/modal'
import { formatHTMLToText, formatTextToHTML } from '@/utils/format/formatter'
import { ResultType } from '@/interfaces/search'

const PostForm: React.FC = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.authReducer)
  const result = useSelector((state: RootState) => state.searchReducer.result)
  const { post, isSubOpen } = useSelector((state: RootState) => state.modalReducer)
  const [showImages, setShowImages] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [croppedAreaList, setCroppedAreaList] = useState<Area[]>([])
  const [postContent, setPostContent] = useState<string>('')
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [search, setSearch] = useState(false)
  const [cropStates, setCropStates] = useState<{ crop: Point; zoom: number }[]>([])
  useEffect(() => {
    if (post) {
      const content = formatHTMLToText(post.content)
      setPostContent(content)
    }
  }, [post, isSubOpen])
  const handleAddImages = async (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    const init = await initializeImage(fileList, showImages, croppedAreaList, cropStates)
    
    if (init) {
      setShowImages(init.newMediaList)
      setCroppedAreaList(init.newCroppedAreas)
      setCropStates(init.newCropStates)
    }
  }
  const onCropComplete = (croppedAreaPixels: Area, croppedArea: Area) => {
    const updatedCroppedAreas = [...croppedAreaList]
    updatedCroppedAreas[currentImageIndex] = croppedArea
    setCroppedAreaList(updatedCroppedAreas)
    setCropStates(cropStates => {
      const updatedCropStates = [...cropStates]
      updatedCropStates[currentImageIndex] = { crop, zoom }
      return updatedCropStates
    })
  }
  const onNextClick = (): void => {
    if (post) {
      if (currentImageIndex < post.postMedias.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1)
      }
    } else {
      if (currentImageIndex < showImages.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1)
        setCrop(cropStates[currentImageIndex + 1].crop)
        setZoom(cropStates[currentImageIndex + 1].zoom)
      }
    }
  }
  const onPrevClick = () => {
    if (post) {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1)
      }
    } else {
      if (currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1)
        setCrop(cropStates[currentImageIndex - 1].crop)
        setZoom(cropStates[currentImageIndex - 1].zoom)
      }
    }
  }
  const handlePostContent = (e: React.ChangeEvent<HTMLInputElement>) => {
    const Content = e.target.value
    setPostContent(Content)
    const hashtagRegex = /#(\S+)/g
    let keyword = null
    let match
    const lastChar = Content[Content.length - 1]
    if (lastChar === ' ') {
      setSearch(false)
      keyword = null
    } else if (lastChar === '#') {
      setSearch(true)
    }
    while ((match = hashtagRegex.exec(Content)) !== null && search) {
      let hashtag = match[1]
      keyword = hashtag
    }
    if (keyword !== null) {
      dispatch(getSearchResult({ keyword, type: 'tag' }) as any)
    } else {
      dispatch(resetResult())
    }
  }
  const handleuploadPost = async () => {
    let croppedImgList: Blob[] = []

    for (let i = 0; i < showImages.length; i++) {
      const croppedImage = await getCroppedImg(showImages[i], croppedAreaList[i])
      if (croppedImage) {
        croppedImgList.push(croppedImage)
      }
    }
    const regex = /#([a-zA-Z0-9가-힣_]+)/g
    const matches = postContent.match(regex)
    const content = formatTextToHTML(postContent)
    let post: uploadPostType = {
      content: content,
      postMedias: croppedImgList,
    }
    if (matches) {
      const tags = matches.map(match => match.replace(/^#/, ''))
      post.hashtags = tags
    }
    dispatch(uploadPost(post) as any)
    dispatch(openModal({ modalType: 'PostingModal', id: null, post: null }))
  }
  const handleUpdatePost = async () => {
    const regex = /#([a-zA-Z0-9가-힣_]+)/g
    const matches = postContent.match(regex)
    const content = formatTextToHTML(postContent)
    if (post) {
      let postInfo: updatePostType = {
        content: content,
        postId: post.id.toString(),
      }
      if (matches) {
        const tags = matches.map(match => match.replace(/^#/, ''))
        postInfo.hashtags = tags
      }
      dispatch(updatePost({ postInfo }) as any)
      dispatch(closeSubModal())
    }
  }
  const handleHasTag = (name: string) => {
    const lastIndex = postContent.lastIndexOf('#')
    const extractedString = postContent.substring(0, lastIndex + 1)
    setPostContent(extractedString + name)
  }
  return (
    <div>
      <Modal
        open={isSubOpen}
        onClose={() => {
          dispatch(closeSubModal())
        }}
      >
        <div className="relative left-1/2 top-1/2 h-[740px] w-[1060px] -translate-x-1/2 -translate-y-1/2 transform rounded-lg bg-white">
          <div className="flex h-10 w-full items-center justify-center border-b text-body16sd">
            {post ? '게시물 수정' : '새 게시물 만들기'}
            <div className="absolute right-0">
              <Button
                onClick={() => {
                  dispatch(closeSubModal())
                }}
              >
                취소
              </Button>
              <Button
                disabled={post ? false : postContent === '' || showImages.length === 0}
                onClick={post ? handleUpdatePost : handleuploadPost}
              >
                완료
              </Button>
            </div>
          </div>
          <div className="flex h-[calc(100%-2.5rem)] w-full">
            <div className="relative flex w-[700px] justify-start overflow-hidden">
              {post ? (
                <div className="flex flex-col justify-center overflow-hidden rounded-bl-lg">
                  {currentImageIndex > 0 && (
                    <div className="switch-btn left-2">
                      <IconButton
                        aria-label="fingerprint"
                        color="secondary"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                        onClick={onPrevClick}
                      >
                        <ChevronLeftIcon style={{ color: 'black' }} />
                      </IconButton>
                    </div>
                  )}
                  {post.postMedias.length > 1 && currentImageIndex < post.postMedias.length - 1 && (
                    <div className="switch-btn right-2">
                      <IconButton
                        aria-label="fingerprint"
                        color="secondary"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                        onClick={onNextClick}
                      >
                        <NavigateNextIcon style={{ color: 'black' }} />
                      </IconButton>
                    </div>
                  )}
                  <div>
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        transform: `translateX(-${currentImageIndex * 100}%)`,
                      }}
                    >
                      {post.postMedias.map((media: MediaListType, index: number) => (
                        <img key={index} src={media.path} alt="img" />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {showImages.length === 0 ? (
                    <div className="flex size-full items-center justify-center text-body18sd">
                      <label htmlFor="fileInput">
                        <div className="p-5 text-center">
                          <ImageSearchIcon sx={{ fontSize: 100 }} />
                        </div>
                        당신의 추억을 업로드하세요!
                      </label>
                      <input
                        className="hidden"
                        type="file"
                        id="fileInput"
                        accept="image/*,video/*"
                        onChange={handleAddImages}
                        multiple
                      />
                    </div>
                  ) : (
                    <div className="relative size-full overflow-hidden">
                      <Cropper
                        image={showImages[currentImageIndex]}
                        crop={crop}
                        zoom={zoom}
                        aspect={1 / 1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        objectFit="cover"
                        showGrid
                      />
                      {currentImageIndex > 0 && (
                        <IconButton
                          className="switch-btn left-2"
                          aria-label="fingerprint"
                          color="secondary"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          }}
                          onClick={onPrevClick}
                        >
                          <ChevronLeftIcon style={{ color: 'black' }} />
                        </IconButton>
                      )}
                      {showImages.length > 1 && currentImageIndex < showImages.length - 1 && (
                        <IconButton
                          className="switch-btn right-2"
                          aria-label="fingerprint"
                          color="secondary"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          }}
                          onClick={onNextClick}
                        >
                          <NavigateNextIcon style={{ color: 'black' }} />
                        </IconButton>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="h-full w-[360px] border-l">
              <div>
                {user && (
                  <div className="flex items-center px-1 py-3">
                    <Avatar alt="profile" src={user.profileImage?.path} />
                    <div className="ml-2 text-body14m">{user.nickname}</div>
                  </div>
                )}
                <div className="border-b">
                  <TextField
                    variant="standard"
                    className="w-full"
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
                <div className="border-b py-1 text-center text-body14sd">tag</div>
                <div className="h-[200px] overflow-y-scroll border-b">
                  {result.map((r: ResultType) => (
                    <div
                      className="cursor-pointer border-b px-3 py-2"
                      key={r.id}
                      onClick={() => handleHasTag(r.name)}
                    >
                      <div className="text-body14sd">#{r.name}</div>
                      <span className="text-body14rg text-gray-500">게시물 {r.tagCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PostForm
