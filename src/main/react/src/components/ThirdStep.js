import React from 'react'

import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Error from '@material-ui/icons/Error'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'

import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { update_sql } from '../actions/main-actions'

const useStyles = makeStyles(() => ({
  text: {
    textAlign: 'center'
  },
  formContainer: {
    marginTop: 30
  },
  success: {
    color: '#388E3C'
  },
  error: {
    color: '#D32F2F'
  },
  form: {
    width: '100%'
  }
}))

export default function ThirdStep() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const notifSql = useSelector(state => state.notifSql)
  const category = useSelector(state => state.category)
  const sql_error = useSelector(state => state.sql_error)
  const keywords = useSelector(state => state.keywords)

  return (
    <div>
      <Typography className={classes.text}>
        Provide SQL for your {category}. This SQL statement must return pidm, termcode, levelcode,
        and schoolcode, in that specific order. It may not modify any tables.
      </Typography>
      <div className={classes.formContainer}>
        <FormControl component='fieldset' className={classes.form}>
          <TextField
            required
            multiline
            label='SQL'
            color='secondary'
            value={notifSql}
            onChange={event => dispatch(update_sql(event.target.value))}
            error={sql_error}
          />
        </FormControl>
        <div>
          <List>
            <ListItem>
              <ListItemIcon>
                {notifSql.toLowerCase().includes('pidm') ? (
                  <CheckCircle className={classes.success} />
                ) : (
                  <Error className={classes.error} />
                )}
              </ListItemIcon>
              <ListItemText primary='Returns pidm' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {notifSql.toLowerCase().includes('termcode') ? (
                  <CheckCircle className={classes.success} />
                ) : (
                  <Error className={classes.error} />
                )}
              </ListItemIcon>
              <ListItemText primary='Returns termcode' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {notifSql.toLowerCase().includes('levelcode') ? (
                  <CheckCircle className={classes.success} />
                ) : (
                  <Error className={classes.error} />
                )}
              </ListItemIcon>
              <ListItemText primary='Returns levelcode' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {notifSql.toLowerCase().includes('schoolcode') ? (
                  <CheckCircle className={classes.success} />
                ) : (
                  <Error className={classes.error} />
                )}
              </ListItemIcon>
              <ListItemText primary='Returns schoolcode' />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                {notifSql.toLowerCase().split(" ").some(word => !keywords.includes(word)) ? (
                  <CheckCircle className={classes.success} />
                ) : (
                  <Error className={classes.error} />
                )}
              </ListItemIcon>
              <ListItemText primary='Does not modify any tables' />
            </ListItem>
          </List>
        </div>
      </div>
    </div>
  )
}
