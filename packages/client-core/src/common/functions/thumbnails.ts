/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/EtherealEngine/etherealengine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Ethereal Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Ethereal Engine team.

All portions of the code written by the Ethereal Engine team are Copyright © 2021-2023 
Ethereal Engine. All Rights Reserved.
*/

import { StaticResourceType } from '@etherealengine/common/src/schema.type.module'

// Adapted from https://github.com/codepo8/canvasthumber
function resize(imageWidth: number, imageHeight: number, thumbWidth: number, thumbHeight: number) {
  let w = 0,
    h = 0,
    x = 0,
    y = 0
  const widthRatio = imageWidth / thumbWidth,
    heightRatio = imageHeight / thumbHeight,
    maxRatio = Math.max(widthRatio, heightRatio)
  if (maxRatio > 1) {
    w = imageWidth / maxRatio
    h = imageHeight / maxRatio
  } else {
    w = imageWidth
    h = imageHeight
  }
  x = (thumbWidth - w) / 2
  y = (thumbHeight - h) / 2
  return { w: w, h: h, x: x, y: y }
}

export async function generateImageFileThumbnail(
  file: Blob | MediaSource,
  width?: number,
  height?: number,
  background?: string
): Promise<Blob | null> {
  const url = URL.createObjectURL(file)
  const img = new Image()

  await new Promise((resolve, reject) => {
    img.src = url
    img.onload = resolve
    img.onerror = reject
  })

  URL.revokeObjectURL(url)
  return generateMediaThumbnail(img, width, height, background)
}

export async function generateVideoFileThumbnail(
  file: Blob | MediaSource,
  width?: number,
  height?: number,
  background?: string
): Promise<Blob | null> {
  const url = URL.createObjectURL(file)
  const video = document.createElement('video')

  await new Promise((resolve, reject) => {
    video.src = url
    video.onloadeddata = resolve
    video.onerror = reject
  })

  URL.revokeObjectURL(url)

  await new Promise((resolve, reject) => {
    video.currentTime = 1
    video.onseeked = resolve
    video.onerror = reject
  })

  return generateMediaThumbnail(video, width, height, background)
}

export async function generateMediaThumbnail(
  el: HTMLImageElement | HTMLVideoElement,
  width = 256,
  height = 256,
  background = '#000'
): Promise<Blob | null> {
  const elWidth = el instanceof HTMLImageElement ? el.width : (el as HTMLVideoElement).videoWidth
  const elHeight = el instanceof HTMLImageElement ? el.height : (el as HTMLVideoElement).videoHeight
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')!
  const dimensions = resize(elWidth, elHeight, width, height)

  if (background !== 'transparent') {
    ctx.fillStyle = background
    ctx.fillRect(0, 0, width, height)
  }

  ctx.drawImage(el, dimensions.x, dimensions.y, dimensions.w, dimensions.h)

  return getCanvasBlob(canvas, background === 'transparent' ? 'image/png' : undefined)
}

export function getCanvasBlob(canvas: HTMLCanvasElement, fileType = 'image/jpeg', quality = 0.9): Promise<Blob | null> {
  if ((canvas as any).msToBlob) {
    return Promise.resolve((canvas as any).msToBlob())
  } else {
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, fileType, quality))
  }
}

const generatorTypes = [
  {
    types: ['image/jpeg', 'image/jpg', 'image/png', 'jpeg', 'jpg', 'png'], // TODO: , ktx2
    gen: async (blob) => {
      return await generateImageFileThumbnail(blob, 256, 256, 'transparent')
    }
  },
  {
    types: ['application/vnd.apple.mpegurl', 'm3u8', 'mp4', 'video/mp4'],
    gen: async (blob) => {
      return await generateVideoFileThumbnail(blob, 256, 256, 'transparent')
    }
  },
  {
    types: [
      'fbx',
      'glb',
      'gltf',
      'gltf-binary',
      'model/fbx',
      'model/glb',
      'model/gltf',
      'model/gltf-binary',
      'model/usdz',
      'model/vrm',
      'usdz',
      'vrm'
    ],
    gen: null // TODO: model thumbnail, based on ECS preview support
  }
]

const thumbnailGeneratorsByType = new Map()
for (const entry of generatorTypes) {
  for (const type of entry.types) {
    thumbnailGeneratorsByType.set(type, entry.gen)
  }
}

export const fileTypeCanHaveThumbnail = (type: string): boolean => thumbnailGeneratorsByType.has(type)

export const createThumbnailForResource = async (resource: StaticResourceType): Promise<Blob | null> => {
  const generator = thumbnailGeneratorsByType.get(resource.mimeType)
  if (generator == null) {
    return null
  }
  const blob = await (await fetch(resource.url)).blob()
  return (await generator(blob)) ?? null
}

export const fileThumbnailCache: Map<string, string> = new Map()
