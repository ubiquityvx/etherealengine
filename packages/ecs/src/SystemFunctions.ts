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

/** Functions to provide system level functionalities. */

import { FC, useEffect } from 'react'

import { OpaqueType } from '@etherealengine/common/src/interfaces/OpaqueType'
import multiLogger from '@etherealengine/common/src/logger'
import { getMutableState, getState, startReactor } from '@etherealengine/hyperflux'

import { MathUtils } from 'three'
import { SystemState } from './SystemState'
import { nowMilliseconds } from './Timer'

const logger = multiLogger.child({ component: 'engine:ecs:SystemFunctions' })

export type SystemUUID = OpaqueType<'SystemUUID'> & string

export type InsertSystem = {
  before?: SystemUUID
  with?: SystemUUID
  after?: SystemUUID
}

export interface SystemArgs {
  uuid: string
  insert: InsertSystem
  timeStep?: number | 'variable'
  execute?: () => void
  reactor?: FC
}

export interface System {
  uuid: SystemUUID
  /**
   * The timestep for the system.
   * If set to 'variable', the system will run every frame.
   * If set to a number, the system will run every n milliseconds.
   * Defaults to 'variable'.
   */
  timeStep: number | 'variable'
  /** @deprecated use defineState reactor instead */
  reactor?: FC
  insert?: InsertSystem
  preSystems: SystemUUID[]
  /** runs after preSystems, and before subSystems */
  execute: () => void
  subSystems: SystemUUID[]
  postSystems: SystemUUID[]
  sceneSystem?: boolean
  // debug
  systemDuration?: number
}

export const SystemDefinitions = new Map<SystemUUID, System>()
globalThis.SystemDefinitions = SystemDefinitions

const lastWarningTime = new Map<SystemUUID, number>()
const warningCooldownDuration = 1000 * 10 // 10 seconds

export function executeSystem(systemUUID: SystemUUID) {
  const system = SystemDefinitions.get(systemUUID)!
  if (!system) {
    console.warn(`System ${systemUUID} does not exist.`)
    return
  }

  for (let i = 0; i < system.preSystems.length; i++) {
    executeSystem(system.preSystems[i])
  }

  if (system.reactor && !getState(SystemState).activeSystemReactors.has(system.uuid)) {
    const reactor = startReactor(system.reactor)
    getState(SystemState).activeSystemReactors.set(system.uuid, reactor)
  }

  const startTime = nowMilliseconds()

  try {
    getMutableState(SystemState).currentSystemUUID.set(systemUUID)
    system.execute()
  } catch (e) {
    logger.error(`Failed to execute system ${system.uuid}`)
    logger.error(e)
  } finally {
    getMutableState(SystemState).currentSystemUUID.set('__null__' as SystemUUID)
  }

  const endTime = nowMilliseconds()

  if (getState(SystemState).performanceProfilingEnabled) {
    const systemDuration = endTime - startTime
    system.systemDuration = systemDuration
    if (systemDuration > 50 && (lastWarningTime.get(systemUUID) ?? 0) < endTime - warningCooldownDuration) {
      lastWarningTime.set(systemUUID, endTime)
      logger.warn(`Long system execution detected. System: ${system.uuid} \n Duration: ${systemDuration}`)
    }
  }

  for (let i = 0; i < system.subSystems.length; i++) {
    executeSystem(system.subSystems[i])
  }
  for (let i = 0; i < system.postSystems.length; i++) {
    executeSystem(system.postSystems[i])
  }
}

/**
 * Defines a system
 * @param systemConfig
 * @returns
 */
export function defineSystem(systemConfig: SystemArgs) {
  if (SystemDefinitions.has(systemConfig.uuid as SystemUUID)) {
    throw new Error(`System ${systemConfig.uuid} already exists.`)
  }

  console.log(`Registered system ${systemConfig.uuid}`)

  const system = {
    preSystems: [],
    execute: () => {},
    subSystems: [],
    postSystems: [],
    sceneSystem: false,
    timeStep: 'variable',
    ...systemConfig,
    uuid: systemConfig.uuid as SystemUUID,
    enabled: false,
    systemDuration: 0
  } as Required<System>

  SystemDefinitions.set(system.uuid, system)

  const insert = system.insert

  if (insert?.before) {
    const referenceSystem = SystemDefinitions.get(insert.before)!
    referenceSystem.preSystems.push(system.uuid)
  }

  if (insert?.with) {
    const referenceSystem = SystemDefinitions.get(insert.with)!
    referenceSystem.subSystems.push(system.uuid)
  }

  if (insert?.after) {
    const referenceSystem = SystemDefinitions.get(insert.after)!
    referenceSystem.postSystems.push(system.uuid)
  }

  return systemConfig.uuid as SystemUUID
}

export const useExecute = (execute: () => void, insert: InsertSystem) => {
  useEffect(() => {
    const handle = defineSystem({ uuid: MathUtils.generateUUID(), execute, insert })
    return () => {
      destroySystem(handle)
    }
  }, [])
}

/**
 * Disables a system
 * @param systemUUID
 * @todo Should this be async?
 */
export const destroySystem = (systemUUID: SystemUUID) => {
  const system = SystemDefinitions.get(systemUUID)
  if (!system) throw new Error(`System ${systemUUID} does not exist.`)

  for (const subSystem of system.subSystems) {
    destroySystem(subSystem)
  }

  const reactor = getState(SystemState).activeSystemReactors.get(system.uuid as SystemUUID)!
  if (reactor) {
    getState(SystemState).activeSystemReactors.delete(system.uuid as SystemUUID)
    reactor.stop()
  }

  for (const postSystem of system.postSystems) {
    destroySystem(postSystem)
  }

  for (const preSystem of system.preSystems) {
    destroySystem(preSystem)
  }

  const insert = system.insert

  if (insert?.before) {
    const referenceSystem = SystemDefinitions.get(insert.before)!
    referenceSystem.preSystems.splice(referenceSystem.preSystems.indexOf(system.uuid), 1)
  }

  if (insert?.with) {
    const referenceSystem = SystemDefinitions.get(insert.with)!
    referenceSystem.subSystems.splice(referenceSystem.subSystems.indexOf(system.uuid), 1)
  }

  if (insert?.after) {
    const referenceSystem = SystemDefinitions.get(insert.after)!
    referenceSystem.postSystems.splice(referenceSystem.postSystems.indexOf(system.uuid), 1)
  }

  SystemDefinitions.delete(systemUUID)
}
