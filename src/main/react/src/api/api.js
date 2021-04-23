/* global is_demo */
/* global token */

import notifications from './notifications.json'

export const get_notifs = async () => {
  if (is_demo) {
    return notifications
  }

  try {
    // remove prepended '/notifications' if running outside of uPortal
    const response = await fetch('/notifications/notifications/v1/notifications/all', {
      credentials: 'include',
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      }
    })

    const data = await response.json()
    return data
  } catch (err) {
    return err
  }
}

export const delete_notif = async id => {
  if (is_demo) {
    return 200
  }

  try {
    // remove prepended '/notifications' if running outside of uPortal
    const response = await fetch('/notifications/notifications/v1/' + id + '/removal', {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    })

    return await response.status
  } catch (err) {
    return err
  }
}

export const approve_notif = async (group, id, approved, sqlApproved, moderatorApproved) => {
  if (is_demo) {
    return 200
  }
  
  try {
    if (group === 'developer') {
      const active = approved && moderatorApproved === true

      // remove prepended '/notifications' if running outside of uPortal
      const response = await fetch('/notifications/notifications/v1/' + id + '/approval/developer', {
        credentials: 'include',
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({approved, active})
      })

      return await response.ok
    } else if (group === 'moderator') {
      const active = approved && sqlApproved === true

      // remove prepended '/notifications' if running outside of uPortal
      const response = await fetch('/notifications/notifications/v1/' + id + '/approval/moderator', {
        credentials: 'include',
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ approved, active })
      })

      return await response.status
    }
  } catch (err) {
    return err
  }
}

export const create_notif = async notif => {
  if (is_demo) {
    return true
  }

  try {
    // remove prepended '/notifications' if running outside of uPortal
    const response = await fetch('/notifications/notifications/v1/notification-type', {
      credentials: 'include',
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(notif)
    })

    return await response.json()
  } catch (err) {
    return err
  }
}

export const disable_notif = async (id, disabled) => {
  if (is_demo) {
    return 200
  }

  try {
    // remove prepended '/notifications' if running outside of uPortal
    const response = await fetch('/notifications/notifications/v1/' + id + '/disable', {
      credentials: 'include',
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(disabled)
    })

    return await response.status
  } catch (err) {
    return err
  }
}
