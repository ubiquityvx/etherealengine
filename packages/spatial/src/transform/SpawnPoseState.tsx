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

import { EntityUUID, UUIDComponent, setComponent } from '@etherealengine/ecs'
import { defineState, getMutableState, useHookstate } from '@etherealengine/hyperflux'
import React, { useLayoutEffect } from 'react'
import { Quaternion, Vector3 } from 'three'
import { SpawnObjectActions } from './SpawnObjectActions'
import { TransformComponent } from './components/TransformComponent'

export const SpawnPoseState = defineState({
  name: 'ee.SpawnPoseState',

  initial: {} as Record<
    EntityUUID,
    {
      spawnPosition: Vector3
      spawnRotation: Quaternion
    }
  >,

  receptors: {
    onSpawnObject: SpawnObjectActions.spawnObject.receive((action) => {
      getMutableState(SpawnPoseState)[action.entityUUID].merge({
        spawnPosition: action.position ? new Vector3().copy(action.position) : new Vector3(),
        spawnRotation: action.rotation ? new Quaternion().copy(action.rotation) : new Quaternion()
      })
    })
  },

  reactor: () => {
    const state = useHookstate(getMutableState(SpawnPoseState))
    return (
      <>
        {state.keys.map((uuid: EntityUUID) => (
          <EntityNetworkReactor uuid={uuid} key={uuid} />
        ))}
      </>
    )
  }
})

const EntityNetworkReactor = (props: { uuid: EntityUUID }) => {
  const state = useHookstate(getMutableState(SpawnPoseState)[props.uuid])
  const entity = UUIDComponent.useEntityByUUID(props.uuid)

  useLayoutEffect(() => {
    if (!entity) return
    setComponent(entity, TransformComponent, {
      position: state.spawnPosition.value,
      rotation: state.spawnRotation.value
    })
  }, [entity, state.spawnPosition, state.spawnRotation])

  return null
}
