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

import { destroyEngine } from '@etherealengine/ecs'
import { getMutableState, getState, useHookstate } from '@etherealengine/hyperflux'
import { render } from '@testing-library/react'
import assert from 'assert'
import React, { useEffect } from 'react'
import { act } from 'react-dom/test-utils'
import sinon from 'sinon'
import { createEngine } from '../initializeEngine'
import { PerformanceManager, PerformanceState } from './PerformanceState'
import { RendererState } from './RendererState'
import { EngineRenderer, RenderSettingsState } from './WebGLRendererSystem'

describe('PerformanceState', () => {
  const mockRenderer = {
    renderContext: {
      getParameter: (param: number): number => {
        return param
      },
      MAX_3D_TEXTURE_SIZE: 1000,
      MAX_TEXTURE_SIZE: 2000,
      MAX_TEXTURE_IMAGE_UNITS: 3000,
      MAX_ELEMENTS_INDICES: 4000,
      MAX_ELEMENTS_VERTICES: 5000
    }
  } as unknown as EngineRenderer

  let screen
  let dpr

  before(() => {
    screen = globalThis.window.screen
    //@ts-ignore
    globalThis.window.screen = {
      availWidth: 2000,
      availHeight: 1000
    }
    dpr = globalThis.window.devicePixelRatio
    globalThis.window.devicePixelRatio = 3
  })

  after(() => {
    globalThis.window.screen = screen
    globalThis.window.devicePixelRatio = dpr
  })

  beforeEach(async () => {
    createEngine()
  })

  afterEach(() => {
    return destroyEngine()
  })

  it('Builds Performance State', (done) => {
    PerformanceManager.buildPerformanceState(
      mockRenderer,
      () => {
        const performanceState = getState(PerformanceState)
        const budgets = performanceState.budgets
        assert(budgets.max3DTextureSize === 1000)
        assert(budgets.maxBufferSize === 54000000000)
        assert(budgets.maxIndices === 8000)
        assert(budgets.maxTextureSize === 2000)
        assert(budgets.maxVerticies === 10000)
        done()
      },
      { renderer: 'nvidia corporation, nvidia geforce rtx 3070/pcie/sse2, ' }
    )
  })

  it('Increments performance offset', (done) => {
    const performanceState = getMutableState(PerformanceState)
    const initialOffset = performanceState.performanceOffset.value

    const Reactor = () => {
      const performance = useHookstate(performanceState)

      useEffect(() => {
        if (initialOffset !== performance.performanceOffset.value) {
          assert(performance.performanceOffset.value === initialOffset + 1)
        }
      }, [performance.performanceOffset])

      return <></>
    }

    const { rerender, unmount } = render(<Reactor />)
    const clock = sinon.useFakeTimers()
    act(async () => {
      PerformanceManager.decrementPerformance()
      clock.tick(3000)
      rerender(<Reactor />)
      clock.restore()
    }).then(() => {
      unmount()
      done()
    })
  })

  it('Increments performance tier', (done) => {
    const performanceState = getMutableState(PerformanceState)
    const initialTier = performanceState.tier.value

    const Reactor = () => {
      const performance = useHookstate(performanceState)

      useEffect(() => {
        if (initialTier !== performance.tier.value) {
          assert(performance.tier.value === initialTier + 1)
        }
      }, [performanceState.tier])

      return <></>
    }

    const { rerender, unmount } = render(<Reactor />)
    const clock = sinon.useFakeTimers()
    act(async () => {
      PerformanceManager.incrementPerformance()
      clock.tick(3000)
      rerender(<Reactor />)
      clock.restore()
    }).then(() => {
      unmount()
      done()
    })
  })

  it('Debounces performance offset', (done) => {
    const performanceState = getMutableState(PerformanceState)
    const initialOffset = performanceState.performanceOffset.value
    const initialTier = performanceState.tier.value

    const Reactor = () => {
      const performance = useHookstate(performanceState)

      useEffect(() => {
        if (initialOffset !== performance.performanceOffset.value) {
          assert(performance.performanceOffset.value === initialOffset + 1)
        }
        if (initialTier !== performance.tier.value) {
          assert(performance.tier.value === initialTier - 1)
        }
      }, [performance.performanceOffset, performance.tier])

      return <></>
    }

    const { rerender, unmount } = render(<Reactor />)
    const clock = sinon.useFakeTimers()
    act(async () => {
      PerformanceManager.decrementPerformance()
      PerformanceManager.decrementPerformance()
      clock.tick(3000)
      rerender(<Reactor />)
      clock.restore()
    }).then(() => {
      unmount()
      done()
    })
  })

  it('Updates render settings reactively', (done) => {
    const performanceState = getMutableState(PerformanceState)
    const initialTier = performanceState.tier.value
    let updatedTier = 5
    if (updatedTier === initialTier) updatedTier -= 1

    const renderSettings = getState(RenderSettingsState)
    const engineSettings = getState(RendererState)

    const { smaaPreset } = renderSettings
    const { shadowMapResolution } = engineSettings

    const Reactor = PerformanceState.reactor

    const { rerender, unmount } = render(<Reactor />)

    act(async () => {
      performanceState.tier.set(updatedTier as any)
      rerender(<Reactor />)
    }).then(() => {
      assert(smaaPreset !== renderSettings.smaaPreset)
      assert(shadowMapResolution !== engineSettings.shadowMapResolution)
      unmount()
      done()
    })
  })
})
