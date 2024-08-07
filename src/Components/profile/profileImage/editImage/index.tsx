import { Modal } from '@mui/material'
import React, { useState } from 'react'
import Cropper, { Area, Point } from 'react-easy-crop'
import getCroppedImg from '@/utils/image-crop'
import { useDispatch } from 'react-redux'
import { updateUser } from '@/redux/user'
import { UpdateProfileInput } from '@/interfaces/user'
interface editImageProps {
  open: boolean
  onClose: () => void
  showImage: string
}
const EditImage: React.FC<editImageProps> = ({ open, onClose, showImage }) => {
  const dispatch = useDispatch()
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [profileImg, setProfileImg] = useState<Blob | null>(null)
  const onCropComplete = async (croppedAreaPixels: Area, croppedArea: Area) => {
    const profileImg = await getCroppedImg(showImage, croppedArea)
    setProfileImg(profileImg)
  }
  const SaveProfileImg = () => {
    if (profileImg) {
      const newInfo = { profileImg } as UpdateProfileInput
      dispatch(updateUser({ newInfo }) as any)
    }
    onClose()
  }
  return (
    <div>
      <Modal open={open} onClose={onClose}>
        <div className="modal">
          <div className="pointer-events-auto relative flex flex-col rounded-lg border bg-white">
            <div className="p-2.5 text-center text-body14sd">이미지 수정</div>
            <div className="size-[500px]">
              <div className="absolute size-[500px] overflow-hidden">
                <Cropper
                  image={showImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1 / 1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="flex justify-end p-2.5">
              <button className='text-body14sd p-1 hover:text-main' onClick={onClose}>취소</button>
              <button className='text-body14sd p-1 hover:text-main' onClick={SaveProfileImg}>저장</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
export default EditImage
