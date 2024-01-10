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

import React, { ReactNode, useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Box, Collapse, Divider, Stack } from '@mui/material'

import ExpandMore from './ExpandMore'
import styles from './styles.module.scss'

interface CollapsibleBlockProps {
  label?: string
  labelContent?: ReactNode
  children: ReactNode
}

export default function CollapsibleBlock({ label, labelContent, children, ...rest }: CollapsibleBlockProps) {
  const [expand, setExpand] = useState<boolean>(false)
  function toggleExpand() {
    setExpand(!expand)
  }
  return (
    <div className={styles.contentContainer} {...rest}>
      <Box className="Box">
        <Stack className="Stack" spacing={1} direction="row">
          <ExpandMore expand={expand} onClick={toggleExpand} aria-expanded={expand} aria-label={label}>
            <ExpandMoreIcon />
          </ExpandMore>
          <label>{label}</label>
          {labelContent}
        </Stack>
      </Box>
      <br />
      <Collapse in={expand} timeout="auto" unmountOnExit>
        <Divider className={styles.divider} />
        {children}
      </Collapse>
    </div>
  )
}
