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

import React, { useEffect } from 'react'
import {
  Color,
  CubeReflectionMapping,
  CubeTexture,
  DataTexture,
  EquirectangularReflectionMapping,
  Mesh,
  MeshMatcapMaterial,
  MeshStandardMaterial,
  RGBAFormat,
  SRGBColorSpace,
  Texture
} from 'three'

import { EntityUUID } from '@etherealengine/common/src/interfaces/EntityUUID'
import { NO_PROXY, getMutableState, getState, useHookstate } from '@etherealengine/hyperflux'

import { isClient } from '@etherealengine/common/src/utils/getEnvironment'
import {
  defineComponent,
  getMutableComponent,
  hasComponent,
  useComponent,
  useOptionalComponent
} from '@etherealengine/ecs/src/ComponentFunctions'
import { Entity } from '@etherealengine/ecs/src/Entity'
import { useEntityContext } from '@etherealengine/ecs/src/EntityFunctions'
import { SceneState } from '@etherealengine/engine/src/scene/Scene'
import { UUIDComponent } from '@etherealengine/spatial/src/common/UUIDComponent'
import { RendererState } from '@etherealengine/spatial/src/renderer/RendererState'
import { GroupComponent } from '@etherealengine/spatial/src/renderer/components/GroupComponent'
import { MeshComponent } from '@etherealengine/spatial/src/renderer/components/MeshComponent'
import { useTexture } from '../../assets/functions/resourceHooks'
import { EnvMapSourceType, EnvMapTextureType } from '../constants/EnvMapEnum'
import { getRGBArray, loadCubeMapTexture } from '../constants/Util'
import { addError, removeError } from '../functions/ErrorFunctions'
import { EnvMapBakeComponent, applyBoxProjection } from './EnvMapBakeComponent'
import { SceneAssetPendingTagComponent } from './SceneAssetPendingTagComponent'
import { SceneObjectComponent } from './SceneObjectComponent'

const tempColor = new Color()

export const EnvmapComponent = defineComponent({
  name: 'EnvmapComponent',
  jsonID: 'envmap',
  onInit: (entity) => {
    return {
      type: EnvMapSourceType.None as (typeof EnvMapSourceType)[keyof typeof EnvMapSourceType],
      envMapTextureType:
        EnvMapTextureType.Equirectangular as (typeof EnvMapTextureType)[keyof typeof EnvMapTextureType],
      envMapSourceColor: new Color(0xfff) as Color,
      envMapSourceURL: '',
      envMapSourceEntityUUID: '' as EntityUUID,
      envMapIntensity: 1,
      // internal
      envmap: null as Texture | null
    }
  },

  onSet: (entity, component, json) => {
    if (typeof json?.type === 'string') component.type.set(json.type)
    if (typeof json?.envMapTextureType === 'string') component.envMapTextureType.set(json.envMapTextureType)
    if (typeof json?.envMapSourceColor === 'number') component.envMapSourceColor.set(new Color(json.envMapSourceColor))
    if (typeof json?.envMapSourceURL === 'string') component.envMapSourceURL.set(json.envMapSourceURL)
    if (typeof json?.envMapSourceEntityUUID === 'string')
      component.envMapSourceEntityUUID.set(json.envMapSourceEntityUUID)
    if (typeof json?.envMapIntensity === 'number') component.envMapIntensity.set(json.envMapIntensity)
    /**
     * Add SceneAssetPendingTagComponent to tell scene loading system we should wait for this asset to load
     */
    if (
      isClient &&
      !getState(SceneState).sceneLoaded &&
      hasComponent(entity, SceneObjectComponent) &&
      component.type.value !== EnvMapSourceType.None
    )
      SceneAssetPendingTagComponent.addResource(entity, EnvmapComponent.jsonID)
  },

  toJSON: (entity, component) => {
    return {
      type: component.type.value,
      envMapTextureType: component.envMapTextureType.value,
      envMapSourceColor: component.envMapSourceColor.value,
      envMapSourceURL: component.envMapSourceURL.value,
      envMapSourceEntityUUID: component.envMapSourceEntityUUID.value,
      envMapIntensity: component.envMapIntensity.value
    }
  },

  reactor: function () {
    const entity = useEntityContext()
    if (!isClient) return null

    const component = useComponent(entity, EnvmapComponent)
    const background = useHookstate(getMutableState(SceneState).background)
    const mesh = useOptionalComponent(entity, MeshComponent)?.value as Mesh<any, any> | null
    const [envMapTexture, unload, error] = useTexture(
      component.envMapTextureType.value === EnvMapTextureType.Equirectangular ? component.envMapSourceURL.value : '',
      entity
    )

    useEffect(() => {
      updateEnvMapIntensity(mesh, component.envMapIntensity.value)
    }, [mesh, component.envMapIntensity])

    useEffect(() => {
      if (component.type.value !== EnvMapSourceType.Skybox) return
      component.envmap.set(null)
      updateEnvMap(mesh, background.value as Texture | null)
      SceneAssetPendingTagComponent.removeResource(entity, EnvmapComponent.jsonID)
    }, [component.type, mesh, background])

    useEffect(() => {
      if (component.type.value !== EnvMapSourceType.Color) return

      const col = component.envMapSourceColor.value ?? tempColor
      const resolution = 64 // Min value required
      const texture = new DataTexture(getRGBArray(col), resolution, resolution, RGBAFormat)
      texture.needsUpdate = true
      texture.colorSpace = SRGBColorSpace
      texture.mapping = EquirectangularReflectionMapping
      component.envmap.set(texture)
      SceneAssetPendingTagComponent.removeResource(entity, EnvmapComponent.jsonID)
    }, [component.type, component.envMapSourceColor])

    useEffect(() => {
      const texture = envMapTexture.get(NO_PROXY)
      if (!texture) return

      texture.mapping = EquirectangularReflectionMapping
      component.envmap.set(texture)
      SceneAssetPendingTagComponent.removeResource(entity, EnvmapComponent.jsonID)

      return unload
    }, [envMapTexture])

    useEffect(() => {
      if (!error.value) return

      component.envmap.set(null)
      addError(entity, EnvmapComponent, 'MISSING_FILE', 'Skybox texture could not be found!')
      SceneAssetPendingTagComponent.removeResource(entity, EnvmapComponent.jsonID)
    }, [error])

    useEffect(() => {
      if (component.type.value !== EnvMapSourceType.Texture) return

      if (component.envMapTextureType.value == EnvMapTextureType.Cubemap) {
        loadCubeMapTexture(
          component.envMapSourceURL.value,
          (texture: CubeTexture | undefined) => {
            SceneAssetPendingTagComponent.removeResource(entity, EnvmapComponent.jsonID)
            if (texture) {
              texture.mapping = CubeReflectionMapping
              texture.colorSpace = SRGBColorSpace
              component.envmap.set(texture)
              removeError(entity, EnvmapComponent, 'MISSING_FILE')
            }
          },
          undefined,
          (_) => {
            component.envmap.set(null)
            addError(entity, EnvmapComponent, 'MISSING_FILE', 'Skybox texture could not be found!')
            SceneAssetPendingTagComponent.removeResource(entity, EnvmapComponent.jsonID)
          }
        )
      }
    }, [component.type, component.envMapSourceURL])

    useEffect(() => {
      if (!component.envmap.value) return
      updateEnvMap(mesh, component.envmap.value)
      SceneAssetPendingTagComponent.removeResource(entity, EnvmapComponent.jsonID)
    }, [mesh, component.envmap])

    useEffect(() => {
      const envmap = component.envmap.value
      if (!envmap) return

      return () => {
        envmap.dispose()
      }
    }, [component.envmap])

    const bakeEntity = UUIDComponent.getEntityByUUID(component.envMapSourceEntityUUID.value)

    if (component.type.value !== EnvMapSourceType.Bake) return null

    return <EnvBakeComponentReactor key={bakeEntity} envmapEntity={entity} bakeEntity={bakeEntity} />
  },

  errors: ['MISSING_FILE']
})

const EnvBakeComponentReactor = (props: { envmapEntity: Entity; bakeEntity: Entity }) => {
  const { envmapEntity, bakeEntity } = props
  const bakeComponent = useComponent(bakeEntity, EnvMapBakeComponent)
  const group = useComponent(envmapEntity, GroupComponent)
  const renderState = useHookstate(getMutableState(RendererState))
  const [envMaptexture, unload, error] = useTexture(bakeComponent.envMapOrigin.value, envmapEntity)

  useEffect(() => {
    return unload
  }, [])

  /** @todo add an unmount cleanup for applyBoxprojection */
  useEffect(() => {
    const texture = envMaptexture.get(NO_PROXY)
    if (!texture) return

    texture.mapping = EquirectangularReflectionMapping
    getMutableComponent(envmapEntity, EnvmapComponent).envmap.set(texture)
    if (bakeComponent.boxProjection.value) applyBoxProjection(bakeEntity, group.value)
    SceneAssetPendingTagComponent.removeResource(props.envmapEntity, EnvmapComponent.jsonID)
  }, [envMaptexture])

  useEffect(() => {
    if (!error.value) return
    addError(envmapEntity, EnvmapComponent, 'MISSING_FILE', 'Skybox texture could not be found!')
    SceneAssetPendingTagComponent.removeResource(props.envmapEntity, EnvmapComponent.jsonID)
  }, [error])

  return null
}

function updateEnvMap(obj: Mesh<any, any> | null, envmap: Texture | null) {
  if (!obj) return
  if (!obj.material) return
  if (Array.isArray(obj.material)) {
    obj.material.forEach((mat: MeshStandardMaterial) => {
      if (mat instanceof MeshMatcapMaterial) return
      mat.envMap = envmap!
    })
  } else {
    if (obj.material instanceof MeshMatcapMaterial) return
    obj.material.envMap = envmap!
  }
}

const updateEnvMapIntensity = (obj: Mesh<any, any> | null, intensity: number) => {
  if (!obj) return
  if (!obj.material) return
  if (Array.isArray(obj.material)) {
    obj.material.forEach((m: MeshStandardMaterial) => {
      m.envMapIntensity = intensity
    })
  } else {
    ;(obj.material as MeshStandardMaterial).envMapIntensity = intensity
  }
}
