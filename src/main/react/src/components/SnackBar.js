import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

export default function SnackBar(props) {
  const { message, open, set_open } = props

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    set_open(false)
  }

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      />
    </div>
  )
}
