import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'

import { useSelector } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'

import ReactMarkdown from 'react-markdown'
const gfm = require('remark-gfm')

const useStyles = makeStyles(() => ({
  text: {
    textAlign: 'center',
    paddingBottom: 40
  },
  form: {
    marginTop: 30
  },
  element: {
    margin: '10px 0px'
  },
  attribute: {
    display: 'flex',
    padding: '10px 0px'
  },
  title: {
    marginRight: 20,
    width: '42%',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  desc: {
    width: '100%'
  }
}))

export default function FourthStep() {
  const classes = useStyles()

  const notifName = useSelector(state => state.notifName)
  const notifDesc = useSelector(state => state.notifDesc)
  const dateStart = useSelector(state => state.dateStart)
  const dateEnd = useSelector(state => state.dateEnd)
  const urlMore = useSelector(state => state.urlMore)
  const richText = useSelector(state => state.richText)
  const category = useSelector(state => state.category)
  const unique = useSelector(state => state.unique)
  const snoozeLength = useSelector(state => state.snoozeLength)
  const notifSql = useSelector(state => state.notifSql)
  const priorityId = useSelector(state => state.priorityId)

  return (
    <div>
      <Typography className={classes.text}>
        Review your {category}. Once you submit, it cannot be edited.
      </Typography>
      <div>
        <FormControl component='fieldset' className={classes.desc}>
          <div>
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>Title</strong>
              </Typography>
              <Typography className={classes.desc}>{notifName}</Typography>
            </div>
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>Description</strong>
              </Typography>
              <Typography className={classes.desc}>{notifDesc}</Typography>
            </div>
            {urlMore !== null && (
              <div className={classes.attribute}>
                <Typography className={classes.title}>
                  <strong>URL</strong>
                </Typography>
                <Typography className={classes.desc}>{urlMore}</Typography>
              </div>
            )}
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>Start Date</strong>
              </Typography>
              <Typography className={classes.desc}>{dateStart.toDateString()}</Typography>
            </div>
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>End Date</strong>
              </Typography>
              <Typography className={classes.desc}>{dateEnd.toDateString()}</Typography>
            </div>
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>Priority</strong>
              </Typography>
              <Typography className={classes.desc}>{priorityId}</Typography>
            </div>
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>Snooze Length</strong>
              </Typography>
              <Typography className={classes.desc}>{snoozeLength} days</Typography>
            </div>
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>Unique</strong>
              </Typography>
              <Typography className={classes.desc}>{unique}</Typography>
            </div>
            {richText !== null && (
              <div className={classes.attribute}>
                <Typography className={classes.title}>
                  <strong>Rich Text</strong>
                </Typography>
                <Typography className={classes.desc}>
                  <div className="mde-preview">
                    <ReactMarkdown plugins={[gfm]} className="mde-preview-content" source={richText}/>
                  </div>
                </Typography>
              </div>
            )}
            <div className={classes.attribute}>
              <Typography className={classes.title}>
                <strong>SQL</strong>
              </Typography>
              <Typography className={classes.desc}>{notifSql}</Typography>
            </div>
          </div>
        </FormControl>
      </div>
    </div>
  )
}
