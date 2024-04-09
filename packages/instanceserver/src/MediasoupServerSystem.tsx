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
import { defineSystem } from '@etherealengine/ecs/src/SystemFunctions'
import React, { useEffect } from 'react'

import { DataChannelType } from '@etherealengine/common/src/interfaces/DataChannelType'
import { InstanceID } from '@etherealengine/common/src/schema.type.module'
import { PresentationSystemGroup } from '@etherealengine/ecs/src/SystemGroups'
import { SceneState } from '@etherealengine/engine/src/scene/Scene'
import { defineActionQueue, getMutableState, getState, useHookstate } from '@etherealengine/hyperflux'
import { NetworkState } from '@etherealengine/spatial/src/networking/NetworkState'
import { NetworkTopics } from '@etherealengine/spatial/src/networking/classes/Network'
import { DataChannelRegistryState } from '@etherealengine/spatial/src/networking/systems/DataChannelRegistry'
import {
  MediasoupDataConsumerActions,
  MediasoupDataProducerActions
} from '@etherealengine/spatial/src/networking/systems/MediasoupDataProducerConsumerState'
import {
  MediasoupMediaConsumerActions,
  MediasoupMediaProducerActions
} from '@etherealengine/spatial/src/networking/systems/MediasoupMediaProducerConsumerState'
import { MediasoupTransportActions } from '@etherealengine/spatial/src/networking/systems/MediasoupTransportState'
import { SocketWebRTCServerNetwork } from './SocketWebRTCServerFunctions'
import {
  createOutgoingDataProducer,
  handleConsumeData,
  handleConsumerSetLayers,
  handleProduceData,
  handleRequestConsumer,
  handleRequestProducer,
  handleWebRtcTransportClose,
  handleWebRtcTransportConnect,
  handleWebRtcTransportCreate
} from './WebRTCFunctions'

/** @todo replace this with event sourcing */
const requestConsumerActionQueue = defineActionQueue(MediasoupMediaConsumerActions.requestConsumer.matches)
const consumerLayersActionQueue = defineActionQueue(MediasoupMediaConsumerActions.consumerLayers.matches)
const requestProducerActionQueue = defineActionQueue(MediasoupMediaProducerActions.requestProducer.matches)

const dataRequestProducerActionQueue = defineActionQueue(MediasoupDataProducerActions.requestProducer.matches)
const dataRequestConsumerActionQueue = defineActionQueue(MediasoupDataConsumerActions.requestConsumer.matches)

const requestTransportActionQueue = defineActionQueue(MediasoupTransportActions.requestTransport.matches)
const requestTransportConnectActionQueue = defineActionQueue(MediasoupTransportActions.requestTransportConnect.matches)
const transportCloseActionQueue = defineActionQueue(MediasoupTransportActions.transportClosed.matches)

const execute = () => {
  // queues will accumulate actions until the scene is loaded, then they will be processed
  if (!getState(SceneState).sceneLoaded) return

  for (const action of requestConsumerActionQueue()) {
    handleRequestConsumer(action)
  }
  for (const action of consumerLayersActionQueue()) {
    handleConsumerSetLayers(action)
  }
  for (const action of requestProducerActionQueue()) {
    handleRequestProducer(action)
  }

  for (const action of dataRequestProducerActionQueue()) {
    handleProduceData(action)
  }
  for (const action of dataRequestConsumerActionQueue()) {
    handleConsumeData(action)
  }

  for (const action of requestTransportActionQueue()) {
    handleWebRtcTransportCreate(action)
  }
  for (const action of requestTransportConnectActionQueue()) {
    handleWebRtcTransportConnect(action)
  }
  for (const action of transportCloseActionQueue()) {
    handleWebRtcTransportClose(action)
  }
}

export const DataChannel = (props: { networkID: InstanceID; dataChannelType: DataChannelType }) => {
  const { networkID, dataChannelType } = props

  useEffect(() => {
    const network = getState(NetworkState).networks[networkID] as SocketWebRTCServerNetwork
    createOutgoingDataProducer(network, dataChannelType)

    return () => {
      // todo - cleanup
    }
  }, [])

  return null
}

const NetworkReactor = (props: { networkID: InstanceID }) => {
  const { networkID } = props
  const dataChannelRegistry = useHookstate(getMutableState(DataChannelRegistryState))
  return (
    <>
      {dataChannelRegistry.keys.map((dataChannelType) => (
        <DataChannel key={dataChannelType} networkID={networkID} dataChannelType={dataChannelType as DataChannelType} />
      ))}
    </>
  )
}

export const reactor = () => {
  const networkIDs = Object.entries(useHookstate(getMutableState(NetworkState).networks).value)
    .filter(([networkID, network]) => network.topic === NetworkTopics.world)
    .map(([networkID, network]) => networkID)
  return (
    <>
      {networkIDs.map((id: InstanceID) => (
        <NetworkReactor key={id} networkID={id} />
      ))}
    </>
  )
}

export const MediasoupServerSystem = defineSystem({
  uuid: 'ee.instanceserver.MediasoupServerSystem',
  insert: { after: PresentationSystemGroup },
  execute,
  reactor
})
