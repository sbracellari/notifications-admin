import React, { useState } from 'react'

import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'

import ReactMde from 'react-mde'
import Showdown from 'showdown'

import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

import { useSelector, useDispatch } from 'react-redux'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/core/styles'
import {
  update_notif_name,
  update_notif_desc,
  update_date_start,
  update_date_end,
  update_url_more,
  update_rich_text,
} from '../actions/main-actions'

const useStyles = makeStyles((theme) => ({
  textfield: {
    marginBottom: 10,
    paddingRight: 10,
  },
  text: {
    paddingTop: 10,
    paddingBottom: 20,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  title: {
    color: '#000000',
    opacity: 0.6,
    fontSize: 15,
  },
}))

const pickersTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#0064b7',
    },
    secondary: {
      main: '#0074b7',
    },
  },
})

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});

export default function SecondStep() {
  const classes = useStyles()
  const dispatch = useDispatch()

  const notifName = useSelector((state) => state.notifName)
  const notifDesc = useSelector((state) => state.notifDesc)
  const dateStart = useSelector((state) => state.dateStart)
  const dateEnd = useSelector((state) => state.dateEnd)
  const urlMore = useSelector((state) => state.urlMore)
  const richText = useSelector((state) => state.richText)
  const category = useSelector((state) => state.category)
  const name_error = useSelector((state) => state.name_error)
  const desc_error = useSelector((state) => state.desc_error)
  const end_error = useSelector((state) => state.end_error)
  const start_error = useSelector((state) => state.start_error)
  const url_error = useSelector((state) => state.url_error)

  const [selectedTab, setSelectedTab] = useState('write')

  return (
    <>
      <Typography className={classes.text}>Supply your {category} with the following:</Typography>
      <div>
        <FormControl component='fieldset' className={classes.form}>
          <TextField
            required
            multiline
            label='Title'
            color='secondary'
            className={classes.textfield}
            value={notifName}
            onChange={(event) => dispatch(update_notif_name(event.target.value))}
            error={name_error}
            helperText={name_error ? 'Title cannot be more than 40 characters.' : ' '}
          />
          <TextField
            required
            multiline
            label='Description'
            color='secondary'
            className={classes.textfield}
            value={notifDesc}
            onChange={(event) => dispatch(update_notif_desc(event.target.value))}
            error={desc_error}
            helperText={desc_error ? 'Description cannot be more than 125 characters.' : ' '}
          />
          {category === 'notification' && (
            <TextField
              multiline
              label='URL'
              color='secondary'
              placeholder='URL'
              className={classes.textfield}
              value={urlMore}
              onChange={(event) => dispatch(update_url_more(event.target.value))}
              error={url_error}
              helperText={url_error ? 'URL cannot be more than 255 characters.' : ' '}
            ></TextField>
          )}
          <ThemeProvider theme={pickersTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                disableToolbar
                format='MM/dd/yyyy'
                margin='normal'
                label='Start Date'
                color='secondary'
                value={dateStart}
                className={classes.textfield}
                onChange={(date) => dispatch(update_date_start(date))}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                error={start_error}
                helperText={start_error ? 'Start date cannot be before today.' : ' '}
              />
              <KeyboardDatePicker
                disableToolbar
                margin='normal'
                label='End Date'
                format='MM/dd/yyyy'
                color='secondary'
                value={dateEnd}
                className={classes.textfield}
                onChange={(date) => dispatch(update_date_end(date))}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                error={end_error}
                helperText={end_error ? 'End date must be after start date.' : ' '}
              />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
          {category === 'announcement' && (
          <div>
            <Typography className={classes.title}>Rich Text</Typography>
            <ReactMde
              value={richText}
              onChange={(value) => dispatch(update_rich_text(value))}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={() => Promise.resolve(converter.makeHtml(richText))}
              childProps={{
                writeButton: {
                  tabIndex: -1,
                },
              }}
            />
          </div>
          )}
        </FormControl>
      </div>
    </>
  )
}
