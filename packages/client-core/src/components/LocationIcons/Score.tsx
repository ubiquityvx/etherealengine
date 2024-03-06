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

import React, { useEffect, useState } from 'react'

const StatsStyle = (props) => {
  return (
    <style>{`
    #stats-container {
      align-items: center;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    
    #score-number {
      font-size: 48px;
      color: white;
    }

    #statistics-heading {
      font-size: 16px;
      font-weight: bold;
      color: white;
    }

    #statistic {
      font-size: 14px;
      color: white;
    }

  
    `}</style>
  )
}

export const Info = () => {
  const [count, setCount] = useState(20)
  const [frameStyle, setFrameStyle] = useState({})

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 0) {
          return prevCount - 1
        } else {
          setFrameStyle({
            position: 'absolute',
            left: 0,
            bottom: 0,
            transform: 'scale(0.5)',
            pointerEvents: 'all',
            width: '100%',
            height: '100%'
          })
          return 0
        }
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div
      style={{
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        backdropFilter: 'blur(10px) grayscale(100%)',
        backgroundColor: 'rgba(0, 0, 0, 0.616)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          zIndex: 2,
          position: 'relative',

          background: 'white',
          width: '800px',
          height: '550px',
          overflow: 'hidden',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'space-between'
        }}
      >
        <div
          style={{
            background: 'black',
            padding: '20px 30px 20px 30px',
            color: '#0ED8A5',
            display: 'flex',
            fontSize: '32px',
            fontWeight: '700',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          Calibrate!
        </div>
        <div style={{ padding: '20px 30px', height: 'auto', width: '100%', textAlign: 'center' }}>
          Hey there just smile. Calibration completes on {count}
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <iframe width={'100%'} height={'100%'} src={`/capture/${location.pathname.split('/')[2]}`} />
        </div>
      </div>
    </div>
  )
}
;` 
style={count !== 0 ? { position: 'relative', width: '100%', height: '100%' } : frameStyle}

<div
style={{
  zIndex: 2,
  background: 'white',
  width: '800px',
  height: '550px',
  overflow: 'hidden',
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'space-between'
}}
>
<div
  style={{
    background: 'black',
    padding: '20px 30px 20px 30px',
    color: '#0ED8A5',
    display: 'flex',
    fontSize: '32px',
    fontWeight: '700',
    width: '100%',
    justifyContent: 'center'
  }}
>
  Bubble Arm Raise
</div>
<div style={{ padding: '20px 30px', height: '100%', width: '100%', textAlign: 'center' }}>
  Hey There, its an example how to do this:
</div>
<img
  style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'contain' }}
  src={img}
  alt="thumbnail"
/>
</div>
`

export const Score = () => {
  const [start, setStart] = useState(false)
  // setTimeout(() => {
  //   setStart(true)
  // }, 10000)

  return (
    <div
      style={{
        left: 0,
        top: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'space-between',
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        flexDirection: 'column',
        fontFamily: 'Anta, sans-serif',
        zIndex: 999
      }}
    >
      {' '}
      <div
        id="UiMount"
        style={{ pointerEvents: 'all', position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', zIndex: 3 }}
      >
        {/* <div
          style={{
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            position: 'absolute',
            backdropFilter: 'blur(10px) grayscale(100%)',
            backgroundColor: 'rgba(0, 0, 0, 0.616)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Info />
        </div> */}
      </div>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Anta&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')
      </style>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div
          style={{
            display: 'flex',
            width: '130px',
            height: '70px',
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#808080',
            gap: '5px',
            borderRadius: ' 0px 0px 14px 14px',
            fontWeight: 900
          }}
        >
          <svg
            style={{ marginRight: '5px' }}
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.4087 15.1813C17.3852 15.1813 18.3218 15.5693 19.0123 16.2598C19.7028 16.9503 20.0907 17.8869 20.0907 18.8634C20.0907 19.8399 19.7028 20.7765 19.0123 21.467C18.3218 22.1575 17.3852 22.5454 16.4087 22.5454C15.4322 22.5454 14.4956 22.1575 13.8051 21.467C13.1146 20.7765 12.7266 19.8399 12.7266 18.8634C12.7266 17.8869 13.1146 16.9503 13.8051 16.2598C14.4956 15.5693 15.4322 15.1813 16.4087 15.1813ZM5.36253 10.2719C6.66459 10.2719 7.91331 10.7892 8.834 11.7099C9.7547 12.6306 10.2719 13.8793 10.2719 15.1813C10.2719 16.4834 9.7547 17.7321 8.834 18.6528C7.91331 19.5735 6.66459 20.0907 5.36253 20.0907C4.06047 20.0907 2.81175 19.5735 1.89106 18.6528C0.970364 17.7321 0.453125 16.4834 0.453125 15.1813C0.453125 13.8793 0.970364 12.6306 1.89106 11.7099C2.81175 10.7892 4.06047 10.2719 5.36253 10.2719ZM16.4087 0.453125C18.0363 0.453125 19.5972 1.09967 20.748 2.25054C21.8989 3.4014 22.5454 4.96231 22.5454 6.58988C22.5454 8.21745 21.8989 9.77836 20.748 10.9292C19.5972 12.0801 18.0363 12.7266 16.4087 12.7266C14.7811 12.7266 13.2202 12.0801 12.0694 10.9292C10.9185 9.77836 10.2719 8.21745 10.2719 6.58988C10.2719 4.96231 10.9185 3.4014 12.0694 2.25054C13.2202 1.09967 14.7811 0.453125 16.4087 0.453125Z"
              fill="#0ED8A5"
            />
          </svg>

          <div
            style={{
              alignItems: 'center',
              fontSize: '34px',
              color: '#0ED8A5'
            }}
            id="bubblesPopped"
          >
            {0}
          </div>
          <p style={{ fontSize: '15px', position: 'relative', top: '2px', fontWeight: 900 }}>/</p>

          <div
            style={{
              fontSize: '20px'
            }}
            id="bubblesPoppedGoal"
          >
            {12}
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div style={{ background: 'white', padding: '20px 30px 10px 30px', borderRadius: ' 0px 14px 0px 0px' }}>
          <svg width="240" height="44" viewBox="0 0 240 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.2558 33.7197C9.95912 33.7197 7.88584 33.2651 6.03854 32.3559C4.18861 31.4467 2.72234 30.0671 1.63182 28.2172C0.543942 26.3699 0 24.0286 0 21.1959V0.978088H5.72584V21.2379C5.72584 23.6844 6.31445 25.5028 7.49168 26.6958C8.6689 27.8887 10.3007 28.4852 12.3898 28.4852C14.4788 28.4852 16.0712 27.8887 17.2642 26.6958C18.4572 25.5028 19.0537 23.6844 19.0537 21.2379V0.978088H24.7796V21.1959C24.7796 24.0286 24.212 26.3699 23.0794 28.2172C21.9469 30.0671 20.4333 31.4441 18.5387 32.3559C16.6441 33.2651 14.5498 33.7197 12.2558 33.7197Z"
              fill="#110D2D"
            />
            <path
              d="M43.6543 33.7197C41.9857 33.7197 40.5246 33.407 39.2712 32.7816C38.0178 32.1562 37.0035 31.2759 36.2283 30.1433V33.7223H30.5024V0.978088H36.2283V14.172C36.943 13.1866 37.889 12.3247 39.0689 11.5784C40.2461 10.8321 41.7754 10.459 43.6543 10.459C45.7407 10.459 47.6038 10.9661 49.2461 11.9804C50.8858 12.9947 52.1839 14.3822 53.1378 16.1401C54.0916 17.8981 54.5699 19.8978 54.5699 22.134C54.5699 24.3702 54.0916 26.362 53.1378 28.1042C52.1839 29.849 50.8858 31.2207 49.2461 32.2193C47.6064 33.2178 45.7407 33.7171 43.6543 33.7171V33.7197ZM42.4481 28.7112C44.2665 28.7112 45.7722 28.1016 46.9652 26.8771C48.1582 25.6552 48.7547 24.0759 48.7547 22.134C48.7547 20.1921 48.1582 18.6023 46.9652 17.3489C45.7722 16.0955 44.2665 15.4701 42.4481 15.4701C40.6297 15.4701 39.0846 16.0902 37.9074 17.3279C36.7302 18.5655 36.1416 20.1527 36.1416 22.092C36.1416 24.0312 36.7302 25.6184 37.9074 26.856C39.0846 28.0937 40.5982 28.7139 42.4481 28.7139V28.7112Z"
              fill="#110D2D"
            />
            <path
              d="M61.8566 7.55269C60.8134 7.55269 59.9567 7.23999 59.284 6.61458C58.6139 5.98918 58.2776 5.19823 58.2776 4.24437C58.2776 3.2905 58.6139 2.50743 59.284 1.8978C59.9567 1.28291 60.8134 0.978088 61.8566 0.978088C62.8998 0.978088 63.7564 1.28291 64.4291 1.89517C65.0992 2.50743 65.4355 3.2905 65.4355 4.24174C65.4355 5.19298 65.0992 5.98656 64.4291 6.61196C63.759 7.23736 62.8998 7.55006 61.8566 7.55006V7.55269ZM58.995 33.7197V10.9977H64.7208V33.7197H58.995Z"
              fill="#110D2D"
            />
            <path
              d="M87.44 43.022V30.0068C86.7253 30.9922 85.7766 31.8567 84.5994 32.6004C83.4222 33.3466 81.8928 33.7198 80.014 33.7198C77.9276 33.7198 76.0619 33.2126 74.4222 32.1983C72.7825 31.184 71.4844 29.7992 70.5305 28.0386C69.5766 26.2806 69.0984 24.2809 69.0984 22.0447C69.0984 19.8085 69.574 17.8193 70.5305 16.0745C71.4844 14.3297 72.7825 12.9606 74.4222 11.9595C76.0619 10.9609 77.925 10.4617 80.014 10.4617C81.6826 10.4617 83.1436 10.7744 84.3971 11.3998C85.6479 12.0252 86.6622 12.9055 87.4374 14.038V10.9951H93.1632V43.0193H87.4374L87.44 43.022ZM81.2228 28.7087C83.0701 28.7087 84.5836 28.0912 85.7635 26.8509C86.9407 25.6158 87.5293 24.026 87.5293 22.0868C87.5293 20.1475 86.9407 18.5604 85.7635 17.3227C84.5863 16.085 83.0727 15.4649 81.2228 15.4649C79.3728 15.4649 77.8987 16.0771 76.7057 17.299C75.5127 18.5209 74.9162 20.1028 74.9162 22.0395C74.9162 23.9761 75.5127 25.5712 76.7057 26.8246C77.8987 28.078 79.4044 28.7034 81.2228 28.7034V28.7087Z"
              fill="#110D2D"
            />
            <path
              d="M107.301 33.7195C104.528 33.7195 102.387 32.855 100.881 31.126C99.3755 29.3969 98.6213 26.8611 98.6213 23.5213V10.9975H104.303V22.9852C104.303 24.893 104.689 26.354 105.467 27.3683C106.242 28.3826 107.464 28.8898 109.135 28.8898C110.714 28.8898 112.02 28.3248 113.048 27.1896C114.075 26.0571 114.59 24.4778 114.59 22.4492V10.9975H120.316V33.7195H114.59V29.4258C113.904 30.7371 113.137 31.7803 111.839 32.5555C110.541 33.3306 109.027 33.7195 107.298 33.7195H107.301Z"
              fill="#110D2D"
            />
            <path
              d="M129.262 7.55269C128.218 7.55269 127.362 7.23999 126.689 6.61458C126.019 5.98918 125.683 5.19823 125.683 4.24437C125.683 3.2905 126.019 2.50743 126.689 1.8978C127.362 1.28291 128.218 0.978088 129.262 0.978088C130.305 0.978088 131.161 1.28291 131.834 1.89517C132.504 2.50743 132.841 3.2905 132.841 4.24174C132.841 5.19298 132.504 5.98656 131.834 6.61196C131.164 7.23736 130.305 7.55006 129.262 7.55006V7.55269ZM126.4 33.7197V10.9977H132.126V33.7197H126.4Z"
              fill="#110D2D"
            />
            <path
              d="M148.002 33.72C145.677 33.72 143.814 33.1524 142.41 32.0198C141.007 30.8873 140.308 28.8744 140.308 25.9813V15.783H136.506V10.9979H140.308V5.04874H146.034V10.9979H152.028V15.783H146.034V26.026C146.034 27.0981 146.265 27.8365 146.728 28.2385C147.19 28.6406 147.986 28.8429 149.122 28.8429H151.894V33.7173H148.002V33.72Z"
              fill="#110D2D"
            />
            <path
              d="M164.165 33.2467L154.892 10.9976H161.109L167.326 26.609L177.971 0.978088H184.299L165.802 43.0219H159.719L164.162 33.2467H164.165Z"
              fill="#110D2D"
            />
            <path
              d="M194.807 28.1752L201.831 10.9977H206.569H207.959H212.836L218.599 19.0595L224.314 10.9977H230.626L222.349 22.3574L226.692 28.3197L238.719 0.978088H192.174L187.768 10.9977H187.783L194.807 28.1752Z"
              fill="#0ED8A5"
            />
            <path
              d="M224.315 33.7197L218.599 25.6552L212.837 33.7197H206.57L214.802 22.3574L207.447 12.2064L198.329 33.7197H191.239L184.646 18.0873L173.678 43.0219H220.223L224.317 33.7197H224.315Z"
              fill="#0ED8A5"
            />
          </svg>
        </div>
        <div
          style={{
            background: 'black',
            padding: '20px 30px 20px 30px',
            color: '#0ED8A5',
            borderRadius: '14px 0px  0px 0px',
            display: 'flex',
            fontSize: '32px',
            fontWeight: '700'
          }}
        >
          Bubble Arm Raise
        </div>
      </div>
    </div>
  )
}
