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

import { State } from '@hookstate/core'
import * as bitecs from 'bitecs'
import { v4 as uuidv4 } from 'uuid'

import { PeerID } from '@etherealengine/common/src/interfaces/PeerID'
import { ActionQueueHandle, ActionQueueInstance, ResolvedActionType, Topic } from './ActionFunctions'
import { ReactorRoot } from './ReactorFunctions'

export type StringLiteral<T> = T extends string ? (string extends T ? never : T) : never
export interface HyperStore {
  /**
   * The topic to dispatch to when none are supplied
   */
  defaultTopic: Topic
  /**
   *  Topics that should forward their incoming actions to the outgoing queue.
   */
  forwardingTopics: Set<Topic>
  /**
   * A function which returns the dispatch id assigned to actions
   * @deprecated can be derived from agentId via mapping
   * */
  getDispatchId: () => string
  /**
   * The agent id
   */
  peerID: PeerID
  /**
   * A function which returns the current dispatch time (units are arbitrary)
   */
  getDispatchTime: () => number
  /**
   * A function which returns the current reactor root context
   **/
  getCurrentReactorRoot: () => ReactorRoot | undefined
  /**
   * The default dispatch delay (default is 0)
   */
  defaultDispatchDelay: () => number
  /**
   * State dictionary
   */
  stateMap: Record<string, State<any>>

  stateReactors: Record<string, ReactorRoot>

  actions: {
    /** All queues that have been created */
    queues: Map<ActionQueueHandle, ActionQueueInstance>
    /** Cached actions */
    cached: Array<Required<ResolvedActionType>>
    /** Incoming actions */
    incoming: Array<Required<ResolvedActionType>>
    /** All actions that have been applied, in the order they were processed */
    history: Array<ResolvedActionType>
    /** All action UUIDs that have been processed and should not be processed again */
    knownUUIDs: Set<string>
    /** Outgoing actions */
    outgoing: Record<
      Topic,
      {
        /** All actions that are waiting to be sent */
        queue: Array<Required<ResolvedActionType>>
        /** All actions that have been sent */
        history: Array<Required<ResolvedActionType>>
        /** All incoming action UUIDs that have been processed */
        forwardedUUIDs: Set<string>
      }
    >
  }

  receptors: Record<string, () => void>

  /** active reactors */
  activeReactors: Set<ReactorRoot>
}

export class HyperFlux {
  static store: HyperStore
}

export function createHyperStore(options: {
  getDispatchId: () => string
  getDispatchTime: () => number
  defaultDispatchDelay?: () => number
  getCurrentReactorRoot?: () => ReactorRoot | undefined
}) {
  const store: HyperStore = {
    defaultTopic: 'default' as Topic,
    forwardingTopics: new Set<Topic>(),
    getDispatchId: options.getDispatchId,
    getDispatchTime: options.getDispatchTime,
    defaultDispatchDelay: options.defaultDispatchDelay ?? (() => 0),
    getCurrentReactorRoot: options.getCurrentReactorRoot ?? (() => undefined),
    peerID: uuidv4() as PeerID,
    stateMap: {},
    stateReactors: {},
    actions: {
      queues: new Map(),
      cached: [],
      incoming: [],
      history: [],
      knownUUIDs: new Set(),
      outgoing: {}
    },
    receptors: {},
    activeReactors: new Set()
    // toJSON: () => {
    //   const state = Object.entries(store.stateMap).reduce((obj, [name, state]) => {
    //     return merge(obj, { [name]: state.attach(Downgraded).value })
    //   }, {})
    //   return {
    //     ...store,
    //     state
    //   }
    // },
  }
  HyperFlux.store = store
  bitecs.createWorld(store)
  return store
}

export const disposeStore = async (store = HyperFlux.store) => {
  const activeReactors = [] as Promise<void>[]
  for (const reactor of store.activeReactors) {
    activeReactors.push(reactor.stop())
  }
  await Promise.all(activeReactors)
  /** @todo this causes errors in tests */
  // bitecs.deleteWorld(store)
}
