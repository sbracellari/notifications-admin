import React from 'react'

import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import FileCopy from '@material-ui/icons/FileCopy'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import { makeStyles } from '@material-ui/core/styles'
import { useDispatch } from 'react-redux'

import ReactMarkdown from 'react-markdown'

import {
  delete_notification,
  approve_notification,
  disable_notification
} from '../actions/main-actions'

const gfm = require('remark-gfm')

const useStyles = makeStyles(theme => ({
  header: {
    background: theme.palette.primary.light
  },
  tooltip: {
    fontSize: 14
  },
  content: {
    padding: 20,
    maxHeight: 500
  },
  attribute: {
    display: 'flex',
    padding: '10px 0px'
  },
  title: {
    marginRight: 20,
    width: '30%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  desc: {
    width: '100%'
  },
  sqlContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%'
  },
  sql: {
    wordWrap: 'anywhere'
  },
  btn: {
    marginTop: -13
  },
  dialog: {
    width: 580
  }
}))

const determine_buttons = (
  notif,
  group,
  onClose,
  delete_notification,
  approve_notification,
  disable_notification,
  dispatch
) => {
  const active_notif =
    notif.activeInd === true &&
    new Date(notif.dateStart) <= new Date() &&
    new Date(notif.dateEnd) > new Date()
  const scheduled_notif = notif.activeInd === true && new Date(notif.dateStart) > new Date()
  const disabled_notif =
    notif.sqlApproved === true && notif.moderatorApproved === true && notif.activeInd === false
  const dev_denied_notif =
    notif.sqlApproved === false && (notif.moderatorApproved === null || notif.moderatorApproved === true)
  const moderator_denied_notif = notif.sqlApproved === true && notif.moderatorApproved === false
  const dev_pending_notif = notif.sqlApproved === null
  const moderator_pending_notif = notif.sqlApproved === true && notif.moderatorApproved === null

  var buttons = [{ text: 'Close', action: onClose }]

  if (group === 'developer') {
    if (active_notif) {
      buttons.push(
        { text: 'Delete', action: () => dispatch(delete_notification(notif.id)) },
        { text: 'Disable', action: () => dispatch(disable_notification(notif.id, false)) }
      )
      return buttons.reverse()
    } else if (scheduled_notif) {
      buttons.push(
        { text: 'Delete', action: () => dispatch(delete_notification(notif.id)) },
        {
          text: 'Disapprove',
          action: () => dispatch(approve_notification(group, notif.id, false, notif.sqlApproved, notif.moderatorApproved))
        }
      )
      return buttons.reverse()
    } else if (dev_pending_notif) {
      buttons.push(
        { text: 'Deny', action: () => dispatch(approve_notification(group, notif.id, false, notif.sqlApproved, notif.moderatorApproved)) },
        { text: 'Approve', action: () => dispatch(approve_notification(group, notif.id, true, notif.sqlApproved, notif.moderatorApproved)) }
      )
      return buttons.reverse()
    } else if (moderator_pending_notif) {
      buttons.push(
        { text: 'Deny', action: () => dispatch(approve_notification('moderator', notif.id, false, notif.sqlApproved, notif.moderatorApproved)) },
        { text: 'Approve', action: () => dispatch(approve_notification('moderator', notif.id, true, notif.sqlApproved, notif.moderatorApproved)) }
      )
      return buttons.reverse()
    } else if (dev_denied_notif) {
      buttons.push({
        text: 'Approve',
        action: () => dispatch(approve_notification(group, notif.id, true, notif.sqlApproved, notif.moderatorApproved))
      })
      return buttons.reverse()
    } else if (disabled_notif) {
      buttons.push(
        { text: 'Delete', action: () => dispatch(delete_notification(notif.id)) },
        { text: 'Enable', action: () => dispatch(disable_notification(notif.id, true)) }
      )
      return buttons.reverse()
    }
  } else if (group === 'moderator') {
    if (moderator_denied_notif) {
      buttons.push({
        text: 'Approve',
        action: () => dispatch(approve_notification(group, notif.id, true, notif.sqlApproved, notif.moderatorApproved))
      })
      return buttons.reverse()
    } else if (scheduled_notif) {
      buttons.push({
        text: 'Disapprove',
        action: () => dispatch(approve_notification(group, notif.id, false, notif.sqlApproved, notif.moderatorApproved))
      })
      return buttons.reverse()
    } else if (moderator_pending_notif) {
      buttons.push(
        { text: 'Deny', action: () => dispatch(approve_notification(group, notif.id, false, notif.sqlApproved, notif.moderatorApproved)) },
        { text: 'Approve', action: () => dispatch(approve_notification(group, notif.id, true, notif.sqlApproved, notif.moderatorApproved)) }
      )
      return buttons.reverse()
    }
  } else {
    return buttons
  }

  return buttons
}

export default function DisplayModal(props) {
  const classes = useStyles()
  const { notif, i, open, onClose, group } = props
  const dispatch = useDispatch()
  const buttons = determine_buttons(
    notif,
    group,
    onClose,
    delete_notification,
    approve_notification,
    disable_notification,
    dispatch
  )

  return (
    <Dialog key={i} open={open} onClose={onClose} classes={{ paperWidthSm: classes.dialog }}>
      <DialogTitle className={classes.header}>Review {notif.category}</DialogTitle>
      <DialogContent className={classes.content}>
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>Title</strong>
          </Typography>
          <Typography className={classes.desc}>{notif.notifName}</Typography>
        </div>
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>Description</strong>
          </Typography>
          <Typography className={classes.desc}>{notif.notifDesc}</Typography>
        </div>
        {notif.urlMore && (
          <div className={classes.attribute}>
            <Typography className={classes.title}>
              <strong>URL</strong>
            </Typography>
            <Typography className={classes.desc}>{notif.urlMore}</Typography>
          </div>
        )}
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>Start Date</strong>
          </Typography>
          <Typography className={classes.desc}>
            {new Date(notif.dateStart.replace(/-/g, '/')).toDateString()}
          </Typography>
        </div>
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>End Date</strong>
          </Typography>
          <Typography className={classes.desc}>
            {new Date(notif.dateEnd.replace(/-/g, '/')).toDateString()}
          </Typography>
        </div>
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>Author</strong>
          </Typography>
          <Typography className={classes.desc}>
            {notif.author}
          </Typography>
        </div>
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>Priority Level</strong>
          </Typography>
          <Typography className={classes.desc}>{notif.priorityId}</Typography>
        </div>
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>Snooze Length</strong>
          </Typography>
          <Typography className={classes.desc}>{notif.snoozeLength} days</Typography>
        </div>
        <div className={classes.attribute}>
          <Typography className={classes.title}>
            <strong>Unique</strong>
          </Typography>
          <Typography className={classes.desc}>{notif.unique.toString()}</Typography>
        </div>
        {notif.richText && (
          <div className={classes.attribute}>
            <Typography className={classes.title}>
              <strong>Rich Text</strong>
            </Typography>
            <Typography className={classes.desc}>
              <div className="mde-preview">
                <ReactMarkdown plugins={[gfm]} className="mde-preview-content" source={notif.richText} />
              </div>
            </Typography>
          </div>
        )}
        {group === 'developer' && (
          <div className={classes.attribute}>
            <Typography className={classes.title}>
              <strong>SQL</strong>
            </Typography>
            <div className={classes.sqlContainer}>
              <Typography className={classes.sql}>{notif.notifSql}</Typography>
              <div className={classes.btn}>
                <CopyToClipboard text={notif.notifSql}>
                  <Tooltip
                    title='Copy to clipboard'
                    placement='bottom'
                    classes={{
                      tooltip: classes.tooltip
                    }}
                  >
                    <IconButton>
                      <FileCopy />
                    </IconButton>
                  </Tooltip>
                </CopyToClipboard>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        {buttons.map((button, i) => (
          <Button key={i} color='secondary' onClick={button.action}>
            {button.text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  )
}
