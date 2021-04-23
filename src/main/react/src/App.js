/* global group */

import React, { useState, useEffect } from 'react'

import AppBar from '@material-ui/core/AppBar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types'

import ErrorMessage from './components/ErrorMessage'
import NotifCreation from './components/NotifCreation'
import NotifTable from './components/NotifTable'

import { makeStyles } from '@material-ui/core/styles'

import { useSelector, useDispatch } from 'react-redux'
import { fetch_notifications } from './actions/main-actions'

const TabContainer = props => <div style={{ padding: 20 }}>{props.children}</div>

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'hidden'
  },
  tooltip: {
    fontSize: 14
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  group: {
    display: 'flex'
  },
  tab: {
    minWidth: 130
  }
}))

export default function App() {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [tab_value, set_tab_value] = useState(0)
  const [approved_radio_value, set_approved_radio_value] = useState('active')
  const [pending_radio_value, set_pending_radio_value] = useState('sql')

  const denied_notifs = useSelector(state => state.denied_notifs)
  const dev_pending_notifs = useSelector(state => state.dev_pending_notifs)
  const moderator_pending_notifs = useSelector(state => state.moderator_pending_notifs)
  const scheduled_notifs = useSelector(state => state.scheduled_notifs)
  const active_notifs = useSelector(state => state.active_notifs)
  const disabled_notifs = useSelector(state => state.disabled_notifs)
  const general_pending_notifs = useSelector(state => state.general_pending_notifs)

  useEffect(() => {
    dispatch(fetch_notifications())
  }, [dispatch])

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Tabs value={tab_value} onChange={(_event, value) => set_tab_value(value)}>
          <Tab classes={{ root: classes.tab }} aria-label='approved' label='Approved' value={0} />
          <Tab classes={{ root: classes.tab }} aria-label='denied' label='Denied' value={1} />
          <Tab classes={{ root: classes.tab }} aria-label='pending' label='Pending' value={2} />
          {group === 'developer' && (
            <Tab classes={{ root: classes.tab }} aria-label='disabled' label='Disabled' value={3} />
          )}
          <Tab classes={{ root: classes.tab }} aria-label='create' label='Create' value={4} />
        </Tabs>
      </AppBar>
      {tab_value === 0 && (
        <TabContainer>
          <div className={classes.container}>
            <FormControl component='fieldset'>
              <RadioGroup
                value={approved_radio_value}
                onChange={event => set_approved_radio_value(event.target.value)}
              >
                <div className={classes.group}>
                  <FormControlLabel value='active' control={<Radio />} label='Active' />
                  <FormControlLabel value='scheduled' control={<Radio />} label='Scheduled' />
                </div>
              </RadioGroup>
            </FormControl>
          </div>
          {approved_radio_value === 'active' &&
            (active_notifs.length !== 0 ? (
              <NotifTable notifs={active_notifs} group={group} />
            ) : (
              <ErrorMessage title='There are no active notifications at this time' />
            ))}
          {approved_radio_value === 'scheduled' &&
            (scheduled_notifs.length !== 0 ? (
              <NotifTable notifs={scheduled_notifs} group={group} />
            ) : (
              <ErrorMessage title='There are no scheduled notifications at this time' />
            ))}
        </TabContainer>
      )}
      {tab_value === 1 && (
        <TabContainer>
          {denied_notifs.length !== 0 ? (
            <NotifTable notifs={denied_notifs} group={group} />
          ) : (
            <ErrorMessage title='There are no denied notifications at this time' />
          )}
        </TabContainer>
      )}
      {tab_value === 2 && (
        <TabContainer>
          {group === 'developer' && (
            <>
              <FormControl component='fieldset'>
                <RadioGroup
                  value={pending_radio_value}
                  onChange={event => set_pending_radio_value(event.target.value)}
                >
                  <div className={classes.group}>
                    <FormControlLabel value='sql' control={<Radio />} label='Pending SQL Approval' />
                    <FormControlLabel value='general' control={<Radio />} label='Pending Moderator Approval' />
                  </div>
                </RadioGroup>
              </FormControl>
              {pending_radio_value === 'sql' &&
                (dev_pending_notifs.length !== 0 ? (
                  <NotifTable notifs={dev_pending_notifs} group={group} />
                ) : (
                  <ErrorMessage title='There are no notifications pending SQL approval at this time' />
              ))}
              {pending_radio_value === 'general' &&
                (moderator_pending_notifs.length !== 0 ? (
                  <NotifTable notifs={moderator_pending_notifs} group={group} />
                ) : (
                  <ErrorMessage title='There are no notifications pending moderator approval at this time' />
              ))}
            </>
          )}
          {group === 'moderator' &&  (
            moderator_pending_notifs.length !== 0 ? (
              <NotifTable notifs={moderator_pending_notifs} group={group} />
            ) : (
              <ErrorMessage title='There are no notifications pending moderator approval at this time' />
            ))}
          {group === 'author' && (
            general_pending_notifs.length !== 0 ? (
              <NotifTable notifs={general_pending_notifs} group={group} />
            ) : (
              <ErrorMessage title='There are no pending notifications at this time' />
          ))}
        </TabContainer>
      )}
      {tab_value === 3 && (
        <TabContainer>
          {disabled_notifs.length !== 0 ? (
            <NotifTable notifs={disabled_notifs} group={group} />
          ) : (
            <ErrorMessage title='There are no disabled notifications at this time' />
          )}
        </TabContainer>
      )}
      {tab_value === 4 && <NotifCreation group={group} />}
    </div>
  )
}
