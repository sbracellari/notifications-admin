import { get_notifs, delete_notif, disable_notif, approve_notif, create_notif } from '../api/api'

export function fetch_notifications() {
  return function(dispatch) {
    dispatch({ type: 'FETCH_NOTIFS_START', payload: {} })
    get_notifs()
      .then(data => {
        dispatch({ type: 'RECEIVE_NOTIFS', payload: data })
      })
      .catch(err => {
        dispatch({ type: 'FETCH_NOTIFS_ERROR', payload: err })
      })
  }
}

export function delete_notification(id) {
  return function(dispatch) {
    dispatch({ type: 'DELETE_NOTIF_START', payload: {} })
    delete_notif(id)
      .then(data => {
        dispatch({ type: 'DELETE_NOTIF', payload: data })
        dispatch(fetch_notifications())
      })
      .catch(err => {
        dispatch({ type: 'DELETE_NOTIF_ERROR', payload: err })
      })
  }
}

export function disable_notification(id, disabled) {
  return function(dispatch) {
    dispatch({ type: 'DISABLE_NOTIF_START', payload: {} })
    disable_notif(id, disabled)
      .then(data => {
        dispatch({ type: 'DISABLE_NOTIF', payload: data })
        dispatch(fetch_notifications())
      })
      .catch(err => {
        dispatch({ type: 'DISABLE_NOTIF_ERROR', payload: err })
      })
  }
}

export function approve_notification(group, id, approved, sqlApproved, moderatorApproved) {
  return function(dispatch) {
    dispatch({ type: 'APPROVE_NOTIF_START', payload: {} })
    approve_notif(group, id, approved, sqlApproved, moderatorApproved)
      .then(data => {
        dispatch({ type: 'APPROVE_NOTIF', payload: data })
        dispatch(fetch_notifications())
      })
      .catch(err => {
        dispatch({ type: 'APPROVE_NOTIF_ERROR', paylod: err })
      })
  }
}

export function create_notification(notification) {
  return function(dispatch) {
    dispatch({ type: 'CREATE_NOTIF_START', payload: {} })
    create_notif(notification)
      .then(data => {
        dispatch({ type: 'CREATE_NOTIF', payload: data })
        dispatch(fetch_notifications())
      })
      .catch(err => {
        dispatch({ type: 'CREATE_NOTIF_ERROR', payload: err })
      })
  }
}

export function update_category(new_category) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_CATEGORY', payload: new_category })
  }
}

export function update_priorityid(new_priorityid) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_PRIORITYID', payload: new_priorityid })
  }
}

export function update_unique(new_unique) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_UNIQUE', payload: new_unique })
  }
}

export function update_snooze_length(new_snooze_length) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_SNOOZE_LENGTH', payload: new_snooze_length })
  }
}

export function update_notif_name(new_notif_name) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_NOTIF_NAME', payload: new_notif_name })
  }
}

export function update_notif_desc(new_notif_desc) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_NOTIF_DESC', payload: new_notif_desc })
  }
}

export function update_date_start(new_date_start) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_DATE_START', payload: new_date_start })
  }
}

export function update_date_end(new_date_end) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_DATE_END', payload: new_date_end })
  }
}

export function update_url_more(new_url_more) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_URL_MORE', payload: new_url_more })
  }
}

export function update_rich_text(new_rich_text) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_RICH_TEXT', payload: new_rich_text })
  }
}

export function update_sql(new_sql) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_SQL', payload: new_sql })
  }
}

export function update_active_step(new_active_step) {
  return function(dispatch) {
    dispatch({ type: 'UPDATE_ACTIVE_STEP', payload: new_active_step })
  }
}
