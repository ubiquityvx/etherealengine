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

import appRootPath from 'app-root-path'
import cli from 'cli'
import path from 'path'
import { existsSync, rmSync, readFileSync, writeFileSync } from 'fs'
import dotenv from "dotenv-flow";


const lowercaseEnv = process.env.APP_ENV?.toLowerCase() || 'local'

const HOST_REGEX =  /VITE_APP_HOST=([0-9A-Za-z._-]+)/

cli.main(async () => {
  if (process.env.KUBERNETES !== 'true') {
    dotenv.config({
      path: appRootPath.path,
      node_env: 'local'
    })
  }

  console.log('start')
  const localStorageAccessor = readFileSync(path.join(appRootPath.path, 'packages', 'client', 'public', 'local-storage-accessor-template.html')).toString()

  console.log('VITE_APP_HOST', globalThis.process.env.VITE_APP_HOST)

  const localBuildOrDev =
      process.env.APP_ENV === 'development' || globalThis.process.env.VITE_LOCAL_BUILD === 'true'
  const clientUrl = localBuildOrDev && globalThis.process.env.VITE_LOCAL_NGINX !== 'true'
          ? `https://${globalThis.process.env.VITE_APP_HOST}:${globalThis.process.env.VITE_APP_PORT}`
          : `https://${globalThis.process.env.VITE_APP_HOST}`
  const updated = localStorageAccessor.replace('<ROOT_HOSTNAME>', globalThis.process.env.VITE_APP_HOST || 'localhost').replace('"<ALLOWED_DOMAINS>"', `[\`${clientUrl}\`]`)
  console.log('updated', updated)

  writeFileSync(path.join(appRootPath.path, 'packages', 'client', 'public', 'local-storage-accessor.html'), Buffer.from(updated))
  process.exit(0)
})
