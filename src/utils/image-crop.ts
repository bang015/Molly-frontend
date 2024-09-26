import { Area, Point, Size } from 'react-easy-crop/types'

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', error => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180
}

export function rotateSize(
  width: number,
  height: number,
  rotation: number,
): { width: number; height: number } {
  const rotRad = getRadianAngle(rotation)

  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const rotRad = getRadianAngle(rotation)

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(image.width, image.height, rotation)

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1)
  ctx.translate(-image.width / 2, -image.height / 2)

  ctx.drawImage(image, 0, 0)

  const croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) {
    return null
  }

  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  return new Promise<Blob | null>((resolve, reject) => {
    croppedCanvas.toBlob(file => {
      if (file) {
        resolve(file)
      } else {
        reject(new Error('Unable to get the cropped image as a blob'))
      }
    }, 'image/jpeg')
  })
}

export function getCropSize(
  mediaWidth: number,
  mediaHeight: number,
  containerWidth: number,
  containerHeight: number,
  aspect: number,
  rotation = 0,
): Size {
  const { width, height } = rotateSize(mediaWidth, mediaHeight, rotation)
  const fittingWidth = Math.min(width, containerWidth)
  const fittingHeight = Math.min(height, containerHeight)

  if (fittingWidth > fittingHeight * aspect) {
    return {
      width: Math.round(fittingHeight * aspect),
      height: Math.round(fittingHeight),
    }
  }

  return {
    width: Math.round(fittingWidth),
    height: Math.round(fittingWidth / aspect),
  }
}

export const initializeImage = async (
  fileList: any,
  showImages: string[],
  croppedAreaList: Area[],
  cropStates: { crop: Point; zoom: number }[],
) => {
  if (fileList) {
    let newMediaList: string[] = [...showImages]
    let newCroppedAreas: Area[] = [...croppedAreaList]
    let newCropStates: { crop: Point; zoom: number }[] = [...cropStates]
    for (let i = 0; i < fileList.length; i++) {
      const currentFile = fileList[i]
      if (currentFile.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(currentFile)
        newMediaList.push(imageUrl)
        newCropStates.push({ crop: { x: 0, y: 0 }, zoom: 1 })
        const image = new Image()
        image.src = imageUrl
        await new Promise(resolve => {
          image.onload = () => {
            resolve(null)
            const originalImageWidth = image.width
            const originalImageHeight = image.height
            const imageRatio = 7 / 7
            const centerX = originalImageWidth / 2
            const centerY = originalImageHeight / 2
            const cropSize = getCropSize(
              originalImageWidth,
              originalImageHeight,
              originalImageWidth,
              originalImageHeight,
              imageRatio,
            )
            const areaCropSize = {
              width: cropSize.width,
              height: cropSize.height,
              x: centerX - cropSize.width / 2,
              y: centerY - cropSize.height / 2,
            }
            newCroppedAreas.push(areaCropSize)
          }
        })
      }
    }
    if (newMediaList.length > 5) {
      newMediaList = newMediaList.slice(0, 5)
    }
    return { newMediaList, newCroppedAreas, newCropStates }
  }
}
