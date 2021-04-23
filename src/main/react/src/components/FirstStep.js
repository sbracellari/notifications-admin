import React from 'react'

import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import FormLabel from '@material-ui/core/FormLabel'

import { useDispatch, useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import {
  update_unique,
  update_snooze_length,
  update_category,
  update_priorityid,
  update_url_more,
  update_rich_text
} from '../actions/main-actions'

const useStyles = makeStyles(() => ({
  text: {
    paddingTop: 10,
    marginBottom: 30,
    textAlign: 'center'
  },
  container: {
    display: 'flex'
  },
  component: {
    margin: '10px 0px'
  },
  label: {
    fontSize: 20
  },
  focused: {
    color: 'rgba(0, 0, 0, 0.54)'
  },
  form: {
    width: '85%'
  }
}))

const Announcement = ({ classes, unique, snooze_error, snoozeLength, category, dispatch }) => {
  return (
    <>
      <div className={classes.component}>
        <FormLabel component='legend'>Is your {category} unique?</FormLabel>
        <RadioGroup value={unique} onChange={event => dispatch(update_unique(event.target.value))}>
          <div className={classes.container}>
            <FormControlLabel value='true' control={<Radio />} label='Yes' />
            <FormControlLabel value='false' control={<Radio />} label='No' />
          </div>
        </RadioGroup>
      </div>
      <div className={classes.component}>
        <TextField
          id='standard-number'
          label='Snooze Length (in days)'
          InputLabelProps={{
            classes: {
              root: classes.label
            }
          }}
          className={classes.form}
          type='number'
          value={snoozeLength}
          onChange={event => dispatch(update_snooze_length(parseInt(event.target.value)))}
          error={snooze_error}
          required
          helperText={snooze_error ? 'Snooze length must be a number greater than zero' : ' '}
        />
      </div>
    </>
  )
}

export default function FirstStep(props) {
  const { group } = props
  const classes = useStyles()
  const dispatch = useDispatch()

  const unique = useSelector(state => state.unique)
  const snooze_error = useSelector(state => state.snooze_error)
  const snoozeLength = useSelector(state => state.snoozeLength)
  const category = useSelector(state => state.category)
  const priorityId = useSelector(state => state.priorityId)

  const handleCategory = event => {
    if (event.target.value === 'announcement') {
      dispatch(update_priorityid(5))
      dispatch(update_url_more('https://www.google.com/'))
    } else {
      dispatch(update_priorityid(null))
      dispatch(update_url_more(''))
      dispatch(update_rich_text(''))
    }
    dispatch(update_category(event.target.value))
  }

  return (
    <>
      {group === 'developer' && (
        <>
          <Typography className={classes.text}>Please enter the following information:</Typography>
          <FormControl fullWidth>
            <div className={classes.component}>
              <FormLabel component='legend'>
                Are you creating an announcement or a notification?
              </FormLabel>
              <RadioGroup value={category} onChange={handleCategory}>
                <div className={classes.container}>
                  <FormControlLabel value='notification' control={<Radio />} label='Notification' />
                  <FormControlLabel value='announcement' control={<Radio />} label='Announcement' />
                </div>
              </RadioGroup>
            </div>
            <Collapse in={category !== null} timeout='auto' unmountOnExit>
              <div hidden={category === 'announcement'} className={classes.component}>
                <FormLabel component='legend'>What is the priority level?</FormLabel>
                <RadioGroup
                  value={priorityId ? priorityId.toString() : priorityId}
                  onChange={event => dispatch(update_priorityid(parseInt(event.target.value)))}
                >
                  <div className={classes.container}>
                    <FormControlLabel value='1' control={<Radio />} label='1' />
                    <FormControlLabel value='2' control={<Radio />} label='2' />
                    <FormControlLabel value='3' control={<Radio />} label='3' />
                    <FormControlLabel value='4' control={<Radio />} label='4' />
                    <FormControlLabel value='5' control={<Radio />} label='5' />
                  </div>
                </RadioGroup>
              </div>
              <Announcement
                classes={classes}
                unique={unique}
                snooze_error={snooze_error}
                snoozeLength={snoozeLength}
                category={category}
                dispatch={dispatch}
              />
            </Collapse>
          </FormControl>
        </>
      )}
      {(group === 'moderator' || group === 'author') && (
        <div>
          <Typography className={classes.text}>Please enter the following information:</Typography>
          <FormControl fullWidth>
            <Announcement
              classes={classes}
              unique={unique}
              snooze_error={snooze_error}
              snoozeLength={snoozeLength}
              category={category}
              dispatch={dispatch}
            />
          </FormControl>
        </div>
      )}
    </>
  )
}
