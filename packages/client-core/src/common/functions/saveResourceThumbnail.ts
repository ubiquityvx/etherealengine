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

import {
  StaticResourceType,
  fileBrowserUploadPath,
  staticResourcePath
} from '@etherealengine/common/src/schema.type.module'
import { Engine } from '@etherealengine/ecs'
import {
  CancelableUploadPromiseArrayReturnType,
  CancelableUploadPromiseReturnType,
  uploadToFeathersService
} from '../../util/upload'
import { createThumbnailForResource } from './thumbnails'

export const uploadProjectThumbnails = (projectName: string, files: File[]) => {
  const path = `projects/${projectName}/thumbnails`
  const promises: CancelableUploadPromiseReturnType<string>[] = files.map((file) =>
    uploadToFeathersService(fileBrowserUploadPath, [file], { fileName: file.name, path, contentType: '' })
  )
  return {
    cancel: () => promises.forEach((promise) => promise.cancel()),
    promises: promises.map((promise) => promise.promise)
  } as CancelableUploadPromiseArrayReturnType<string>
}

export async function saveResourceThumbnail(resource: StaticResourceType) {
  if (resource.id == null) {
    return
  }

  const thumbnail = await createThumbnailForResource(resource)
  if (thumbnail == null) {
    return
  }
  const thumbnailType = 'automatic'

  // TODO: move this to a utility function
  // https://byby.dev/js-slugify-string
  const thumbnailKey =
    resource.key
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-') + // remove consecutive hyphens
    `-${resource.id}` +
    '-thumbnail'

  // TODO: make these two calls into one async upload asset hooks call
  await Engine.instance.api.service(staticResourcePath).patch(resource.id, { thumbnailKey, thumbnailType })
  await Promise.allSettled(uploadProjectThumbnails(resource.project, [new File([thumbnail], thumbnailKey)]).promises)
}
