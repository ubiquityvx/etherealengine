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

import { SceneDataType, SceneID, UserID } from '@etherealengine/common/src/schema.type.module'
import { EntityUUID, SystemDefinitions, UUIDComponent } from '@etherealengine/ecs'
import { getComponent, hasComponent } from '@etherealengine/ecs/src/ComponentFunctions'
import { Engine, destroyEngine } from '@etherealengine/ecs/src/Engine'
import { UndefinedEntity } from '@etherealengine/ecs/src/Entity'
import { defineQuery } from '@etherealengine/ecs/src/QueryFunctions'
import { SceneState } from '@etherealengine/engine/src/scene/SceneState'
import { getMutableState } from '@etherealengine/hyperflux'
import { EngineState } from '@etherealengine/spatial/src/EngineState'
import { NameComponent } from '@etherealengine/spatial/src/common/NameComponent'
import { EventDispatcher } from '@etherealengine/spatial/src/common/classes/EventDispatcher'
import { createEngine } from '@etherealengine/spatial/src/initializeEngine'
import { Physics } from '@etherealengine/spatial/src/physics/classes/Physics'
import { PhysicsState } from '@etherealengine/spatial/src/physics/state/PhysicsState'
import { FogSettingsComponent } from '@etherealengine/spatial/src/renderer/components/FogSettingsComponent'
import { EntityTreeComponent } from '@etherealengine/spatial/src/transform/components/EntityTree'
import { act, render, waitFor } from '@testing-library/react'
import assert from 'assert'
import React from 'react'
import testSceneJson from '../../../tests/assets/SceneLoadingTest.scene.json'
import { overrideFileLoaderLoad } from '../../../tests/util/loadGLTFAssetNode'
import { ModelComponent } from '../components/ModelComponent'
import { SceneAssetPendingTagComponent } from '../components/SceneAssetPendingTagComponent'
import { SceneDynamicLoadTagComponent } from '../components/SceneDynamicLoadTagComponent'
import { SceneLoadingSystem } from './SceneLoadingSystem'

const NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED
const modelLink = '/packages/projects/default-project/assets/collisioncube.glb'
const testScene = {
  name: '',
  thumbnailUrl: '',
  project: '',
  scenePath: 'test' as SceneID,
  scene: testSceneJson
} as SceneDataType

const sceneID = 'test' as SceneID
overrideFileLoaderLoad()
describe('SceneLoadingSystem', () => {
  beforeEach(async () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '1'
    createEngine()
    Engine.instance.userID = 'user' as UserID
    Engine.instance.store.defaultDispatchDelay = () => 0
    await Physics.load()
    getMutableState(PhysicsState).physicsWorld.set(Physics.createWorld())

    const eventDispatcher = new EventDispatcher()
    ;(Engine.instance.api as any) = {
      service: () => {
        return {
          on: (serviceName, cb) => {
            eventDispatcher.addEventListener(serviceName, cb)
          },
          off: (serviceName, cb) => {
            eventDispatcher.removeEventListener(serviceName, cb)
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = NODE_TLS_REJECT_UNAUTHORIZED
    return destroyEngine()
  })

  const SceneReactor = SystemDefinitions.get(SceneLoadingSystem)!.reactor!
  const sceneTag = <SceneReactor />

  it('will load entities', async () => {
    // init
    SceneState.loadScene(sceneID, testScene)

    const { rerender, unmount } = render(sceneTag)
    await act(() => rerender(sceneTag))

    // assertions
    const rootEntity = SceneState.getRootEntity(sceneID)
    assert(rootEntity, 'root entity not found')
    assert.equal(hasComponent(rootEntity, EntityTreeComponent), true, 'root entity does not have EntityTreeComponent')
    assert.equal(
      getComponent(rootEntity, EntityTreeComponent).parentEntity,
      UndefinedEntity,
      'root entity does not have parentEntity'
    )

    const child0Entity = UUIDComponent.getEntityByUUID('child_0' as EntityUUID)
    assert(child0Entity, 'child_0 entity not found')
    assert.equal(
      hasComponent(child0Entity, EntityTreeComponent),
      true,
      'child_0 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child0Entity, EntityTreeComponent).parentEntity,
      rootEntity,
      'child_0 entity does not have parentEntity as root entity'
    )

    const child1Entity = UUIDComponent.getEntityByUUID('child_1' as EntityUUID)
    assert(child1Entity, 'child_1 entity not found')
    assert.equal(
      hasComponent(child1Entity, EntityTreeComponent),
      true,
      'child_1 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child1Entity, EntityTreeComponent).parentEntity,
      child0Entity,
      'child_1 entity does not have parentEntity as child_0 entity'
    )

    const child2Entity = UUIDComponent.getEntityByUUID('child_2' as EntityUUID)
    assert(child2Entity, 'child_2 entity not found')
    assert.equal(
      hasComponent(child2Entity, EntityTreeComponent),
      true,
      'child_2 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child2Entity, EntityTreeComponent).parentEntity,
      child1Entity,
      'child_2 entity does not have parentEntity as child_1 entity'
    )

    const child3Entity = UUIDComponent.getEntityByUUID('child_3' as EntityUUID)
    assert(child3Entity, 'child_3 entity not found')
    assert.equal(
      hasComponent(child3Entity, EntityTreeComponent),
      true,
      'child_3 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child3Entity, EntityTreeComponent).parentEntity,
      child2Entity,
      'child_3 entity does not have parentEntity as child_2 entity'
    )

    const child4Entity = UUIDComponent.getEntityByUUID('child_4' as EntityUUID)
    assert(child4Entity, 'child_4 entity not found')
    assert.equal(
      hasComponent(child4Entity, EntityTreeComponent),
      true,
      'child_4 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child4Entity, EntityTreeComponent).parentEntity,
      child3Entity,
      'child_4 entity does not have parentEntity as child_3 entity'
    )

    const child5Entity = UUIDComponent.getEntityByUUID('child_5' as EntityUUID)
    assert(child5Entity, 'child_5 entity not found')
    assert.equal(
      hasComponent(child5Entity, EntityTreeComponent),
      true,
      'child_5 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child5Entity, EntityTreeComponent).parentEntity,
      child4Entity,
      'child_5 entity does not have parentEntity as child_4 entity'
    )

    const child2_1Entity = UUIDComponent.getEntityByUUID('child_2_1' as EntityUUID)
    assert(child2_1Entity, 'child_2_1 entity not found')
    assert.equal(
      hasComponent(child2_1Entity, EntityTreeComponent),
      true,
      'child_2_1 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child2_1Entity, EntityTreeComponent).parentEntity,
      child2Entity,
      'child_2_1 entity does not have parentEntity as child_2 entity'
    )
    unmount()
  })
  it('will load correct data', async () => {
    // init
    SceneState.loadScene(sceneID, testScene)
    const { rerender, unmount } = render(sceneTag)
    await act(() => rerender(sceneTag))

    // assertions
    const rootEntity = SceneState.getRootEntity(sceneID)
    assert(rootEntity, 'root entity not found')
    assert.equal(hasComponent(rootEntity, EntityTreeComponent), true, 'root entity does not have EntityTreeComponent')
    assert.equal(
      getComponent(rootEntity, EntityTreeComponent).parentEntity,
      UndefinedEntity,
      'root entity does not have parentEntity'
    )

    const child2_1Entity = UUIDComponent.getEntityByUUID('child_2_1' as EntityUUID)
    assert(child2_1Entity, 'child_2_1 entity not found')
    assert.equal(
      hasComponent(child2_1Entity, EntityTreeComponent),
      true,
      'child_2_1 entity does not have EntityTreeComponent'
    )
    assert.equal(
      hasComponent(child2_1Entity, FogSettingsComponent),
      true,
      'child_2_1 entity does not have FogSettingsComponent'
    )
    const fog = getComponent(child2_1Entity, FogSettingsComponent)
    const originalfogData = testScene.scene.entities['child_2_1'].components.filter(
      (component) => component.name === FogSettingsComponent.jsonID
    )[0]
    assert.deepStrictEqual(fog, originalfogData.props, 'fog component does not match')
    unmount()
  })
  it('will not load dynamic entity', async () => {
    // wont load unless we simulate the avatar and its distance from the dynamic entity
    // its easier to just add the component to the scene and remove it at the end
    const dynamicLoadJson = {
      name: SceneDynamicLoadTagComponent.jsonID,
      props: {
        mode: 'distance',
        distance: 2,
        loaded: false
      }
    }

    testScene.scene.entities['child_0'].components.push(dynamicLoadJson)

    // load scene

    // init
    SceneState.loadScene(sceneID, testScene)
    const { rerender, unmount } = render(sceneTag)
    await act(() => rerender(sceneTag))

    // assertions
    const rootEntity = SceneState.getRootEntity(sceneID)
    assert(rootEntity, 'root entity not found')
    assert.equal(hasComponent(rootEntity, EntityTreeComponent), true, 'root entity does not have EntityTreeComponent')
    assert.equal(
      getComponent(rootEntity, EntityTreeComponent).parentEntity,
      UndefinedEntity,
      'root entity does not have parentEntity'
    )

    const child0Entity = UUIDComponent.getEntityByUUID('child_0' as EntityUUID)
    assert(child0Entity, 'child_0 entity not found')
    assert.equal(
      hasComponent(child0Entity, EntityTreeComponent),
      true,
      'child_0 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child0Entity, EntityTreeComponent).parentEntity,
      rootEntity,
      'child_0 entity does not have parentEntity as root entity'
    )

    // check for failure to load
    const child1Entity = UUIDComponent.getEntityByUUID('child_1' as EntityUUID)
    console.log('DEBUG', child1Entity)
    assert.equal(child1Entity, UndefinedEntity, 'child_1 entity found')
    testScene.scene.entities['child_0'].components = testScene.scene.entities['child_0'].components.filter(
      (component) => component.name !== SceneDynamicLoadTagComponent.jsonID
    )
    unmount()
  })

  it('will load dynamic entity in studio', async () => {
    getMutableState(EngineState).isEditor.set(true)
    getMutableState(EngineState).isEditing.set(true)

    // its easier to just add the component to the scene and remove it at the end
    const dynamicLoadJson = {
      name: SceneDynamicLoadTagComponent.jsonID,
      props: {
        mode: 'distance',
        distance: 2,
        loaded: false
      }
    }

    testScene.scene.entities['child_0'].components.push(dynamicLoadJson)
    // set to location mode

    // load scene

    // init
    SceneState.loadScene(sceneID, testScene)
    const { rerender, unmount } = render(sceneTag)
    await act(() => rerender(sceneTag))

    // assertions
    const rootEntity = SceneState.getRootEntity(sceneID)
    assert(rootEntity, 'root entity not found')
    assert.equal(hasComponent(rootEntity, EntityTreeComponent), true, 'root entity does not have EntityTreeComponent')
    assert.equal(
      getComponent(rootEntity, EntityTreeComponent).parentEntity,
      UndefinedEntity,
      'root entity does not have parentEntity'
    )

    const child0Entity = UUIDComponent.getEntityByUUID('child_0' as EntityUUID)
    assert(child0Entity, 'child_0 entity not found')
    assert.equal(
      hasComponent(child0Entity, EntityTreeComponent),
      true,
      'child_0 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child0Entity, EntityTreeComponent).parentEntity,
      rootEntity,
      'child_0 entity does not have parentEntity as root entity'
    )

    const child1Entity = UUIDComponent.getEntityByUUID('child_1' as EntityUUID)
    assert(child1Entity, 'child_1 entity not found')
    assert.equal(
      hasComponent(child1Entity, EntityTreeComponent),
      true,
      'child_1 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child1Entity, EntityTreeComponent).parentEntity,
      child0Entity,
      'child_1 entity does not have parentEntity as child_0 entity'
    )

    const child2Entity = UUIDComponent.getEntityByUUID('child_2' as EntityUUID)
    assert(child2Entity, 'child_2 entity not found')
    assert.equal(
      hasComponent(child2Entity, EntityTreeComponent),
      true,
      'child_2 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child2Entity, EntityTreeComponent).parentEntity,
      child1Entity,
      'child_2 entity does not have parentEntity as child_1 entity'
    )

    const child3Entity = UUIDComponent.getEntityByUUID('child_3' as EntityUUID)
    assert(child3Entity, 'child_3 entity not found')
    assert.equal(
      hasComponent(child3Entity, EntityTreeComponent),
      true,
      'child_3 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child3Entity, EntityTreeComponent).parentEntity,
      child2Entity,
      'child_3 entity does not have parentEntity as child_2 entity'
    )

    const child4Entity = UUIDComponent.getEntityByUUID('child_4' as EntityUUID)
    assert(child4Entity, 'child_4 entity not found')
    assert.equal(
      hasComponent(child4Entity, EntityTreeComponent),
      true,
      'child_4 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child4Entity, EntityTreeComponent).parentEntity,
      child3Entity,
      'child_4 entity does not have parentEntity as child_3 entity'
    )

    const child5Entity = UUIDComponent.getEntityByUUID('child_5' as EntityUUID)
    assert(child5Entity, 'child_5 entity not found')
    assert.equal(
      hasComponent(child5Entity, EntityTreeComponent),
      true,
      'child_5 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child5Entity, EntityTreeComponent).parentEntity,
      child4Entity,
      'child_5 entity does not have parentEntity as child_4 entity'
    )

    const child2_1Entity = UUIDComponent.getEntityByUUID('child_2_1' as EntityUUID)
    assert(child2_1Entity, 'child_2_1 entity not found')
    assert.equal(
      hasComponent(child2_1Entity, EntityTreeComponent),
      true,
      'child_2_1 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child2_1Entity, EntityTreeComponent).parentEntity,
      child2Entity,
      'child_2_1 entity does not have parentEntity as child_2 entity'
    )
    testScene.scene.entities['child_0'].components = testScene.scene.entities['child_0'].components.filter(
      (component) => component.name !== SceneDynamicLoadTagComponent.jsonID
    )
    unmount()
  })

  it('will load sub-scene from model component', async () => {
    SceneState.loadScene(sceneID, testScene)
    const { rerender, unmount } = render(sceneTag)
    await act(() => rerender(sceneTag))

    // assertions
    const rootEntity = SceneState.getRootEntity(sceneID)
    assert(rootEntity, 'root entity not found')
    assert.equal(hasComponent(rootEntity, EntityTreeComponent), true, 'root entity does not have EntityTreeComponent')
    assert.equal(
      getComponent(rootEntity, EntityTreeComponent).parentEntity,
      UndefinedEntity,
      'root entity does not have parentEntity'
    )
    // load scene with model component

    const child0Entity = UUIDComponent.getEntityByUUID('child_0' as EntityUUID)
    assert(child0Entity, 'child_0 entity not found')

    assert.equal(
      hasComponent(child0Entity, EntityTreeComponent),
      true,
      'child_0 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child0Entity, EntityTreeComponent).parentEntity,
      rootEntity,
      'child_0 entity does not have parentEntity as root entity'
    )
    // check for success of model component

    assert.equal(hasComponent(child0Entity, ModelComponent), true, 'child_0 entity does not have ModelComponent')
    // will capture the sceneAssetPendingTag for the model component
    const model = getComponent(child0Entity, ModelComponent)
    assert.equal(model.src, modelLink, 'model link is different')

    await waitFor(
      () => {
        assert(model.scene !== null, `model scene not found ${model.scene}`)
      },
      { timeout: 1500, interval: 499 }
    )

    assert(model.scene !== null, 'model scene not found')
    const children = getComponent(child0Entity, EntityTreeComponent).children
    assert(children.length > 2)

    const BoxEntity = children[2]
    const colliderEntity = children[1]

    assert(BoxEntity, 'root entity not found')
    assert.equal(hasComponent(BoxEntity, EntityTreeComponent), true, 'Box entity does not have EntityTreeComponent')
    assert.equal(
      getComponent(BoxEntity, EntityTreeComponent).parentEntity,
      child0Entity,
      'Box entity does not have parentEntity'
    )
    assert.equal(getComponent(BoxEntity, NameComponent), 'Box', 'Box entity name is incorrect')

    assert(colliderEntity, 'root entity not found')
    assert.equal(
      hasComponent(colliderEntity, EntityTreeComponent),
      true,
      'collider entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(colliderEntity, EntityTreeComponent).parentEntity,
      child0Entity,
      'collider entity does not have parentEntity'
    )
    assert.equal(getComponent(colliderEntity, NameComponent), 'Collider', 'Collider entity name is incorrect')
    unmount()
  })

  it('will have sceneAssetPendingTagQuery when loading', async () => {
    // init
    SceneState.loadScene(sceneID, testScene)
    const { rerender, unmount } = render(sceneTag)
    await act(() => rerender(sceneTag))

    // load scene
    // force re-render

    const sceneAssetPendingTagQuery = defineQuery([SceneAssetPendingTagComponent]).enter
    // will capture the sceneAssetPendingTag for the model component
    const inLoadingEntities = sceneAssetPendingTagQuery()
    //after loading
    for (const entity of inLoadingEntities) {
      if (entity === SceneState.getRootEntity(sceneID)) {
        assert.equal(
          hasComponent(entity, SceneAssetPendingTagComponent),
          true,
          'root entity does not have SceneAssetPendingTagComponent'
        )
      }
      if (hasComponent(entity, ModelComponent)) {
        assert.equal(
          hasComponent(entity, SceneAssetPendingTagComponent),
          true,
          'entity with model does not have SceneAssetPendingTagComponent'
        )
      }
    }

    const rootEntity = SceneState.getRootEntity(sceneID)
    assert(rootEntity, 'root entity not found')
    assert.equal(hasComponent(rootEntity, EntityTreeComponent), true, 'root entity does not have EntityTreeComponent')
    assert.equal(
      !hasComponent(rootEntity, SceneAssetPendingTagComponent),
      true,
      'root entity has SceneAssetPendingTagComponent after loading'
    )

    assert.equal(
      getComponent(rootEntity, EntityTreeComponent).parentEntity,
      UndefinedEntity,
      'root entity does not have parentEntity'
    )

    const child0Entity = UUIDComponent.getEntityByUUID('child_0' as EntityUUID)
    assert(child0Entity, 'child_0 entity not found')
    assert.equal(
      hasComponent(child0Entity, EntityTreeComponent),
      true,
      'child_0 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child0Entity, EntityTreeComponent).parentEntity,
      rootEntity,
      'child_0 entity does not have parentEntity as root entity'
    )

    const child1Entity = UUIDComponent.getEntityByUUID('child_1' as EntityUUID)
    assert(child1Entity, 'child_1 entity not found')
    assert.equal(
      hasComponent(child1Entity, EntityTreeComponent),
      true,
      'child_1 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child1Entity, EntityTreeComponent).parentEntity,
      child0Entity,
      'child_1 entity does not have parentEntity as child_0 entity'
    )

    const child2Entity = UUIDComponent.getEntityByUUID('child_2' as EntityUUID)
    assert(child2Entity, 'child_2 entity not found')
    assert.equal(
      hasComponent(child2Entity, EntityTreeComponent),
      true,
      'child_2 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child2Entity, EntityTreeComponent).parentEntity,
      child1Entity,
      'child_2 entity does not have parentEntity as child_1 entity'
    )

    const child3Entity = UUIDComponent.getEntityByUUID('child_3' as EntityUUID)
    assert(child3Entity, 'child_3 entity not found')
    assert.equal(
      hasComponent(child3Entity, EntityTreeComponent),
      true,
      'child_3 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child3Entity, EntityTreeComponent).parentEntity,
      child2Entity,
      'child_3 entity does not have parentEntity as child_2 entity'
    )

    const child4Entity = UUIDComponent.getEntityByUUID('child_4' as EntityUUID)
    assert(child4Entity, 'child_4 entity not found')
    assert.equal(
      hasComponent(child4Entity, EntityTreeComponent),
      true,
      'child_4 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child4Entity, EntityTreeComponent).parentEntity,
      child3Entity,
      'child_4 entity does not have parentEntity as child_3 entity'
    )

    const child5Entity = UUIDComponent.getEntityByUUID('child_5' as EntityUUID)
    assert(child5Entity, 'child_5 entity not found')
    assert.equal(
      hasComponent(child5Entity, EntityTreeComponent),
      true,
      'child_5 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child5Entity, EntityTreeComponent).parentEntity,
      child4Entity,
      'child_5 entity does not have parentEntity as child_4 entity'
    )

    const child2_1Entity = UUIDComponent.getEntityByUUID('child_2_1' as EntityUUID)
    assert(child2_1Entity, 'child_2_1 entity not found')
    assert.equal(
      hasComponent(child2_1Entity, EntityTreeComponent),
      true,
      'child_2_1 entity does not have EntityTreeComponent'
    )
    assert.equal(
      getComponent(child2_1Entity, EntityTreeComponent).parentEntity,
      child2Entity,
      'child_2_1 entity does not have parentEntity as child_2 entity'
    )
    unmount()
  })
})
