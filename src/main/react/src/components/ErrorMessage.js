import React from 'react'

import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import Info from '@material-ui/icons/Info'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  header: {
    borderBottom: '1px solid #d3d3d3',
    borderRadius: 0,
    boxShadow: 'none'
  },
  card: {
    borderLeft: '10px solid #31708F',
    margin: 10
  },
  icon: {
    color: '#31708F'
  }
}))

export default function ErrorMessage(props) {
  const classes = useStyles()
  const { title } = props

  return (
    <Card className={classes.card}>
      <CardHeader
        className={classes.header}
        avatar={<Info className={classes.icon} />}
        title={title}
      />
    </Card>
  )
}
