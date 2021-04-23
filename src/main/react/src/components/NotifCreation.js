import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

import SnackBar from './SnackBar'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
import FourthStep from './FourthStep'

import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  create_notification,
  update_category,
  update_priorityid,
  update_rich_text,
  update_url_more,
  update_active_step
} from '../actions/main-actions'

const useStyles = makeStyles(theme => ({
  button: {
    margin: 5
  },
  stepper: {
    padding: 15
  },
  components: {
    margin: '10px 25px'
  },
  buttons: {
    float: 'right',
    marginBottom: 10
  },
  root: {
    margin: 10
  },
  icon: {
    color: theme.palette.secondary.main + '!important'
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 60
  },
  card: {
    width: 500
  }
}))

export default function NotifCreation(props) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { group } = props
  const [steps, set_steps] = useState([])
  const [open, set_open] = useState(false)
  const active_step = useSelector(state => state.active_step)
  const priorityId = useSelector(state => state.priorityId)
  const notifName = useSelector(state => state.notifName)
  const notifDesc = useSelector(state => state.notifDesc)
  const snoozeLength = useSelector(state => state.snoozeLength)
  const dateStart = useSelector(state => state.dateStart)
  const dateEnd = useSelector(state => state.dateEnd)
  const urlMore = useSelector(state => state.urlMore)
  const unique = useSelector(state => state.unique)
  const activeInd = useSelector(state => state.activeInd)
  const richText = useSelector(state => state.richText)
  const notifSql = useSelector(state => state.notifSql)
  const category = useSelector(state => state.category)
  const notif_errs = useSelector(state => state)

  const step_one_error =
    notif_errs.snooze_error || category === null || priorityId === null || unique === null
  const step_two_error =
    notif_errs.name_error ||
    notifName.length === 0 ||
    notif_errs.desc_error ||
    notifDesc.length === 0 ||
    notif_errs.url_error ||
    notif_errs.end_error ||
    notif_errs.start_error
  const step_three_error = notif_errs.sql_error || notifSql === null || notifSql.length === 0

  const handleClick = () => {
    if (active_step === 0 && !step_one_error) {
      dispatch(update_active_step(active_step + 1))
    } else if (active_step === 1 && !step_two_error) {
      urlMore === '' && dispatch(update_url_more(null))
      richText === '' && dispatch(update_rich_text(null))
      dispatch(update_active_step(active_step + 1))
    } else if (active_step === 2 && !step_three_error) {
      dispatch(update_active_step(active_step + 1))
    } else if (active_step === 3) {
      dispatch(
        create_notification({
          priorityId,
          notifName,
          notifDesc,
          snoozeLength,
          dateStart,
          dateEnd,
          urlMore,
          unique,
          activeInd,
          richText,
          notifSql,
          category
        })
      )

      set_open(true)
    }
  }
         

  useEffect(() => {
    if (group === 'developer') {
      set_steps([
        'What would you like to create?',
        'Provide extra information',
        'Who is your intended audience?',
        'Review and Submit'
      ])
    } else if (group === 'moderator' || group === 'author') {
      dispatch(update_category('announcement'))
      dispatch(update_priorityid(5))
      dispatch(update_url_more('https://www.google.com/')) // placeholder until we get domain of announcements-student project
      set_steps([
        'Announcement initial steps',
        'Provide extra information',
        'Who is your intended audience?',
        'Review and Submit'
      ])
    }
  }, [group, dispatch])

  return (
    <>
      <div className={classes.root}>
        <Stepper active_step={active_step} className={classes.stepper}>
          {steps.map(label => {
            return (
              <Step key={label}>
                <StepLabel
                  StepIconProps={{
                    classes: {
                      completed: classes.icon,
                      active: classes.icon
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
        <Divider />
        <div className={classes.container}>
          <Card variant='outlined' className={classes.card}>
            <CardContent>
              <div className={classes.components}>
                {active_step === 0 && <FirstStep group={group} />}
                {active_step === 1 && <SecondStep />}
                {active_step === 2 && <ThirdStep />}
                {active_step === 3 && <FourthStep group={group} />}
              </div>
              <div className={classes.buttons}>
                <Button
                  disabled={active_step === 0}
                  variant='outlined'
                  onClick={() => dispatch(update_active_step(active_step - 1))}
                  className={classes.button}
                >
                  Back
                </Button>
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={handleClick}
                  className={classes.button}
                >
                  {active_step === 3 && 'Submit'}
                  {active_step === 2 && 'Review'}
                  {active_step < 2 && 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SnackBar
        open={open}
        set_open={set_open}
        message={
          notif_errs.create_error
            ? `An error occured. Please try again later.`
            : `Creation successful.`
        }
      />
    </>
  )
}
