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

import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ConfirmDialog from '@etherealengine/client-core/src/common/components/ConfirmDialog'
import multiLogger from '@etherealengine/common/src/logger'
import Box from '@etherealengine/ui/src/primitives/mui/Box'
import Icon from '@etherealengine/ui/src/primitives/mui/Icon'
import IconButton from '@etherealengine/ui/src/primitives/mui/IconButton'
import Tooltip from '@etherealengine/ui/src/primitives/mui/Tooltip'

import { ProjectType, projectPath } from '@etherealengine/common/src/schema.type.module'
import { useFind } from '@etherealengine/spatial/src/common/functions/FeathersHooks'
import { NotificationService } from '../../../common/services/NotificationService'
import { ProjectService } from '../../../common/services/ProjectService'
import { useUserHasAccessHook } from '../../../user/userHasAccess'
import TableComponent from '../../common/Table'
import { projectsColumns } from '../../common/variables/projects'
import styles from '../../styles/admin.module.scss'
import ProjectDrawer from './ProjectDrawer'
import ProjectFilesDrawer from './ProjectFilesDrawer'
import UserPermissionDrawer from './UserPermissionDrawer'

const logger = multiLogger.child({ component: 'client-core:ProjectTable' })

interface Props {
  className?: string
}

interface ConfirmData {
  open: boolean
  processing: boolean
  description: string
  onSubmit: () => void
}

const defaultConfirm: ConfirmData = {
  open: false,
  processing: false,
  description: '',
  onSubmit: () => {}
}

const ProjectTable = ({ className }: Props) => {
  const { t } = useTranslation()
  const [processing, setProcessing] = useState(false)
  const [confirm, setConfirm] = useState({ ...defaultConfirm })
  const [project, _setProject] = useState<ProjectType | undefined>()
  const [showProjectFiles, setShowProjectFiles] = useState(false)
  const [openProjectDrawer, setOpenProjectDrawer] = useState(false)
  const [openUserPermissionDrawer, setOpenUserPermissionDrawer] = useState(false)
  const [changeDestination, setChangeDestination] = useState(false)

  const projectsQuery = useFind(projectPath, {
    query: {
      allowed: true,
      $limit: 100,
      action: 'admin',
      $sort: {
        name: 1
      }
    }
  })

  const projectsData = projectsQuery.data as ProjectType[]

  const projectRef = useRef(project)

  const setProject = (project: ProjectType | undefined) => {
    projectRef.current = project
    _setProject(project)
  }

  useEffect(() => {
    if (project) setProject(projectsData.find((proj) => proj.name === project.name)!)
  }, [projectsData])

  const handleRemoveProject = async () => {
    try {
      if (projectRef.current) {
        const projectToRemove = projectsData.find((p) => p.name === projectRef.current?.name)!
        if (projectToRemove) {
          await ProjectService.removeProject(projectToRemove.id)
          handleCloseConfirmation()
        } else {
          throw new Error('Failed to find the project')
        }
      }
    } catch (err) {
      logger.error(err)
    }
  }

  const handlePushProjectToGithub = async () => {
    try {
      if (projectRef.current) {
        if (!projectRef.current.repositoryPath && projectRef.current.name !== 'default-project') return

        setProcessing(true)
        await ProjectService.pushProject(projectRef.current.id)
        setProcessing(false)

        handleCloseConfirmation()
      }
    } catch (err) {
      setProcessing(false)
      logger.error(err)
    }
  }

  const handleInvalidateCache = async () => {
    try {
      setProcessing(true)
      await ProjectService.invalidateProjectCache(projectRef.current!.name)
      setProcessing(false)

      handleCloseConfirmation()
    } catch (err) {
      setProcessing(false)
      logger.error(err)
    }
  }

  const openPushConfirmation = (row) => {
    setProject(row)

    setConfirm({
      open: true,
      processing: processing,
      description: `${t('admin:components.project.confirmPushProjectToGithub')}? ${row.name} - ${row.repositoryPath}`,
      onSubmit: handlePushProjectToGithub
    })
  }

  const openInvalidateConfirmation = (row) => {
    setProject(row)

    setConfirm({
      open: true,
      processing: processing,
      description: `${t('admin:components.project.confirmProjectInvalidate')} '${row.name}'?`,
      onSubmit: handleInvalidateCache
    })
  }

  const openRemoveConfirmation = (row) => {
    setProject(row)

    setConfirm({
      open: true,
      processing: false,
      description: `${t('admin:components.project.confirmProjectDelete')} '${row.name}'?`,
      onSubmit: handleRemoveProject
    })
  }

  const openViewProject = (row) => {
    setProject(row)
    setShowProjectFiles(true)
  }

  const handleOpenProjectDrawer = (row, changeDestination = false) => {
    setProject(row)
    setChangeDestination(changeDestination)
    setOpenProjectDrawer(true)
  }

  const handleOpenUserPermissionDrawer = (row) => {
    setProject(row)
    setOpenUserPermissionDrawer(true)
  }

  const handleCloseProjectDrawer = () => {
    setChangeDestination(false)
    setOpenProjectDrawer(false)
    setProject(undefined)
  }

  const handleCloseUserPermissionDrawer = () => {
    setOpenUserPermissionDrawer(false)
    setProject(undefined)
  }

  const handleCloseConfirmation = () => {
    setConfirm({ ...confirm, open: false })
    setConfirm({ ...defaultConfirm })
    setProject(undefined)
  }

  const copyShaToClipboard = (sha: string) => {
    navigator.clipboard.writeText(sha)
    NotificationService.dispatchNotify(t('admin:components.project.commitSHACopied'), {
      variant: 'success'
    })
  }

  const hasProjectWritePermission = useUserHasAccessHook('projects:write')

  const createData = (el: ProjectType, name: string) => {
    const commitSHA = el.commitSHA
    return {
      el,
      name: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <a href={`/studio/${name}`} className={`${el.needsRebuild ? styles.orangeColor : ''}`}>
            {name}
          </a>
          {Boolean(el.needsRebuild) && (
            <Tooltip title={t('admin:components.project.outdatedBuild')} arrow>
              <Icon type="ErrorOutline" sx={{ marginLeft: 1 }} className={styles.orangeColor} />
            </Tooltip>
          )}
        </Box>
      ),
      projectVersion: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span>{el.version}</span>
        </Box>
      ),
      enabled: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span>{el.enabled ? t('common:enabled') : t('common:disabled')}</span>
        </Box>
      ),
      commitSHA: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <div className={styles.commitContents}>
            {commitSHA?.substring(0, 8)}
            {commitSHA ? <Icon type="ContentCopy" onClick={() => copyShaToClipboard(commitSHA)} /> : '-'}
          </div>
        </Box>
      ),
      commitDate: (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span>
            {el.commitDate
              ? new Date(el.commitDate).toLocaleString('en-us', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })
              : '-'}
          </span>
        </Box>
      ),
      update: (
        <>
          {hasProjectWritePermission && name !== 'default-project' && (
            <IconButton
              className={styles.iconButton}
              name="update"
              disabled={el.repositoryPath === null}
              onClick={() => handleOpenProjectDrawer(el)}
              icon={<Icon type="Refresh" />}
            />
          )}
          {hasProjectWritePermission && name === 'default-project' && (
            <Tooltip title={t('admin:components.project.defaultProjectUpdateTooltip')} arrow>
              <IconButton className={styles.iconButton} name="update" disabled={true} icon={<Icon type="Refresh" />} />
            </Tooltip>
          )}
        </>
      ),
      push: (
        <>
          {hasProjectWritePermission && (
            <IconButton
              className={styles.iconButton}
              name="update"
              disabled={!el.hasWriteAccess || !el.repositoryPath}
              onClick={() => openPushConfirmation(el)}
              icon={<Icon type="Upload" />}
            />
          )}
        </>
      ),
      link: (
        <>
          {hasProjectWritePermission && (
            <IconButton
              className={styles.iconButton}
              name="update"
              disabled={name === 'default-project'}
              onClick={() => handleOpenProjectDrawer(el, true)}
              icon={<Icon type={!el.repositoryPath ? 'LinkOff' : 'Link'} />}
            />
          )}
        </>
      ),
      projectPermissions: (
        <>
          {hasProjectWritePermission && (
            <IconButton
              className={styles.iconButton}
              name="editProjectPermissions"
              onClick={() => handleOpenUserPermissionDrawer(el)}
              icon={<Icon type="Group" />}
            />
          )}
        </>
      ),
      invalidate: (
        <>
          {hasProjectWritePermission && (
            <IconButton
              className={styles.iconButton}
              name="invalidate"
              onClick={() => openInvalidateConfirmation(el)}
              icon={<Icon type="CleaningServices" />}
            />
          )}
        </>
      ),
      view: (
        <>
          {hasProjectWritePermission && (
            <IconButton
              className={styles.iconButton}
              name="view"
              onClick={() => openViewProject(el)}
              icon={<Icon type="Visibility" />}
            />
          )}
        </>
      ),
      action: (
        <>
          {hasProjectWritePermission && (
            <IconButton
              className={styles.iconButton}
              name="remove"
              onClick={() => openRemoveConfirmation(el)}
              icon={<Icon type="Cancel" />}
            />
          )}
        </>
      )
    }
  }

  const rows = projectsData.map((el) => {
    return createData(el, el.name)
  })

  return (
    <Box className={className}>
      <TableComponent query={projectsQuery} rows={rows} column={projectsColumns} />

      {openProjectDrawer && project && (
        <ProjectDrawer
          open={openProjectDrawer}
          changeDestination={changeDestination}
          inputProject={project}
          existingProject={true}
          onClose={() => handleCloseProjectDrawer()}
        />
      )}

      {project && (
        <UserPermissionDrawer
          open={openUserPermissionDrawer}
          project={project}
          onClose={handleCloseUserPermissionDrawer}
        />
      )}

      {showProjectFiles && project && (
        <ProjectFilesDrawer open selectedProject={project} onClose={() => setShowProjectFiles(false)} />
      )}

      <ConfirmDialog
        processing={processing}
        open={confirm.open}
        description={confirm.description}
        onClose={handleCloseConfirmation}
        onSubmit={confirm.onSubmit}
      />
    </Box>
  )
}

export default ProjectTable
