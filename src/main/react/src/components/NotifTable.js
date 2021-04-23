import React, { useState } from 'react'

import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'

import DisplayModal from './DisplayModal'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  header: {
    fontWeight: 'bolder'
  },
  cell: {
    padding: 10
  },
  tooltip: {
    fontSize: 14
  }
}))

export default function NotifTable(props) {
  const classes = useStyles()
  const [open, set_open] = useState(-1)
  const { group, notifs } = props

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align='left' className={classes.header}>
              Title
            </TableCell>
            <TableCell align='center' className={classes.header}>
              Start Date
            </TableCell>
            <TableCell align='center' className={classes.header}>
              End Date
            </TableCell>
            <TableCell align='center' className={classes.header}>
              Category
            </TableCell>
            <TableCell align='center' className={classes.header}>
              Author
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {notifs.map((notif, i) => (
            <TableRow key={i}>
              <TableCell align='left' className={classes.cell}>
                {notif.notifName}
              </TableCell>
              <TableCell align='center' className={classes.cell}>
                {new Date(notif.dateStart.replace(/-/g, '/')).toDateString()}
              </TableCell>
              <TableCell align='center' className={classes.cell}>
                {new Date(notif.dateEnd.replace(/-/g, '/')).toDateString()}
              </TableCell>
              <TableCell align='center' className={classes.cell}>
                {notif.category}
              </TableCell>
              <TableCell align='center' className={classes.cell}>
                {notif.author}
              </TableCell>
              <TableCell align='center' className={classes.cell}>
                <Tooltip
                  title='More Information'
                  placement='bottom'
                  classes={{
                    tooltip: classes.tooltip
                  }}
                >
                  <IconButton onClick={() => set_open(i)}>
                    <MoreHorizIcon />
                  </IconButton>
                </Tooltip>
                <DisplayModal
                  open={open === i}
                  key={i}
                  notif={notif}
                  onClose={() => set_open(-1)}
                  group={group}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
