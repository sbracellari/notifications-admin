/* global group */

const initial_state = {
  denied_notifs: [],
  dev_denied_notifs: [],
  moderator_denied_notifs: [],
  dev_pending_notifs: [],
  moderator_pending_notifs: [],
  general_pending_notifs: [],
  scheduled_notifs: [],
  active_notifs: [],
  disabled_notifs: [],
  category: null,
  priorityId: null,
  unique: null,
  snoozeLength: 7,
  notifName: '',
  notifDesc: '',
  dateStart: new Date(),
  dateEnd: new Date(Date.now() + 30 * 86400000),
  urlMore: '',
  richText: '',
  notifSql: '',
  activeInd: false,
  disable_error: false,
  delete_error: false,
  approve_error: false,
  fetch_error: false,
  create_error: false,
  fetching: false,
  snooze_error: false,
  name_error: false,
  desc_error: false,
  end_error: false,
  start_error: false,
  url_error: false,
  fetched: false,
  keywords: ['add', 'alter', 'create', 'delete', 'drop', 'truncate'],
  columns: ['pidm', 'termcode', 'levelcode', 'schoolcode'],
  active_step: 0
}

export default function reducer(state = initial_state, action) {
  switch (action.type) {
    case 'FETCH_NOTIFS_START': {
      return { ...state, fetching: true, fetched: false, fetch_error: false }
    }
    case 'DELETE_NOTIF_START': {
      return { ...state, fetching: true, fetched: false, delete_error: false }
    }
    case 'DISABLE_NOTIF_START': {
      return { ...state, fetching: true, fetched: false, disable_error: false }
    }
    case 'APPROVE_NOTIF_START': {
      return { ...state, fetching: true, fetched: false, approve_error: false }
    }
    case 'CREATE_NOTIF_START': {
      return { ...state, fetching: true, fetched: false, create_error: false }
    }
    case 'RECEIVE_NOTIFS': {
      return {
        ...state,
        denied_notifs: action.payload.filter(
          p => p.sqlApproved === false || p.moderatorApproved === false
        ),
        dev_denied_notifs: action.payload.filter(
          p => p.sqlApproved === false && (p.moderatorApproved === null || p.moderatorApproved === true)
        ),
        moderator_denied_notifs: action.payload.filter(
          p => p.sqlApproved === true && p.moderatorApproved === false
        ),
        active_notifs: action.payload.filter(
          p =>
            p.activeInd === true &&
            new Date(p.dateStart) <= new Date() &&
            new Date(p.dateEnd) >= new Date()
        ),
        scheduled_notifs: action.payload.filter(
          p => p.activeInd === true && new Date(p.dateStart) > new Date()
        ),
        dev_pending_notifs: action.payload.filter(p => p.sqlApproved === null),
        moderator_pending_notifs: action.payload.filter(
          p => p.sqlApproved === true && p.moderatorApproved === null
        ),
        general_pending_notifs: action.payload.filter(p => p.sqlApproved === null || p.moderatorApproved === null),
        disabled_notifs: action.payload.filter(
          p => p.sqlApproved === true && p.moderatorApproved === true && p.activeInd === false
        ),
        fetching: false,
        fetched: true,
        fetch_error: false
      }
    }
    case 'DELETE_NOTIF': {
      return { ...state, fetching: false, fetched: true, delete_error: action.payload !== 200 }
    }
    case 'DISABLE_NOTIF': {
      return { ...state, fetching: false, fetched: true, disable_error: action.payload !== 200 }
    }
    case 'APPROVE_NOTIF': {
      return { ...state, fetching: false, fetched: true, approve_error: action.payload !== 200 }
    }
    case 'CREATE_NOTIF': {
      if (action.payload) {
        if (group === 'developer') {
          return {
            ...state,
            fetching: false,
            fetched: true,
            create_error: false,
            category: null,
            priorityId: null,
            unique: null,
            snoozeLength: 7,
            notifName: '',
            notifDesc: '',
            dateStart: new Date(),
            dateEnd: new Date(Date.now() + 30 * 86400000),
            urlMore: '',
            richText: '',
            notifSql: '',
            activeInd: false,
            snooze_error: false,
            name_error: false,
            desc_error: false,
            end_error: false,
            start_error: false,
            url_error: false,
            active_step: 0
          }
        } else if (group === 'moderator') {
          return {
            ...state,
            fetching: false,
            fetched: true,
            create_error: false,
            category: 'announcement',
            priorityId: 5,
            unique: null,
            snoozeLength: 7,
            notifName: '',
            notifDesc: '',
            dateStart: new Date(),
            dateEnd: new Date(Date.now() + 30 * 86400000),
            urlMore: 'https://www.google.com/', // placeholder
            richText: '',
            notifSql: '',
            activeInd: false,
            snooze_error: false,
            name_error: false,
            desc_error: false,
            end_error: false,
            start_error: false,
            url_error: false,
            active_step: 0
          }
        }
      } else {
        return {
          ...state,
          fetching: false,
          fetched: false,
          create_error: true
        }
      }
      break
    }
    case 'FETCH_NOTIFS_ERROR': {
      return { ...state, fetching: true, fetched: false, error: true }
    }
    case 'DELETE_NOTIF_ERROR': {
      return { ...state, fetching: true, fetched: false, delete_error: true }
    }
    case 'DISABLE_NOTIF_ERROR': {
      return { ...state, fetching: true, fetched: false, disable_error: true }
    }
    case 'APPROVE_NOTIF_ERROR': {
      return { ...state, fetching: true, fetched: false, approve_error: true }
    }
    case 'CREATE_NOTIF_ERROR': {
      return { ...state, fetching: true, fetched: false, create_error: true }
    }
    case 'UPDATE_CATEGORY': {
      return { ...state, category: action.payload }
    }
    case 'UPDATE_PRIORITYID': {
      return { ...state, priorityId: action.payload }
    }
    case 'UPDATE_UNIQUE': {
      return { ...state, unique: action.payload }
    }
    case 'UPDATE_SNOOZE_LENGTH': {
      return {
        ...state,
        snoozeLength: action.payload,
        snooze_error: parseInt(action.payload) < 1 || isNaN(parseInt(action.payload))
      }
    }
    case 'UPDATE_NOTIF_NAME': {
      return {
        ...state,
        notifName: action.payload,
        name_error: action.payload.length > 40
      }
    }
    case 'UPDATE_NOTIF_DESC': {
      return {
        ...state,
        notifDesc: action.payload,
        desc_error: action.payload.length > 125
      }
    }
    case 'UPDATE_DATE_START': {
      return {
        ...state,
        dateStart: action.payload,
        start_error: action.payload === 'Invalid Date' || (action.payload && action.payload < new Date()),
        end_error: action.payload && state.dateEnd && state.dateEnd <= action.payload
      }
    }
    case 'UPDATE_DATE_END': {
      return {
        ...state,
        dateEnd: action.payload,
        end_error: action.payload === 'Invalid Date' || (state.dateStart && action.payload && action.payload <= state.dateStart),
      }
    }
    case 'UPDATE_URL_MORE': {
      return {
        ...state,
        urlMore: action.payload,
        url_error: action.payload !== null && action.payload.length > 255
      }
    }
    case 'UPDATE_RICH_TEXT': {
      return { ...state, richText: action.payload }
    }
    case 'UPDATE_SQL': {
      return {
        ...state,
        notifSql: action.payload,
        sql_error:
          action.payload !== null &&
          (action.payload.toLowerCase().split(" ").some(word => state.keywords.includes(word)) ||
            !state.columns.every(word => action.payload.toLowerCase().includes(word)))
      }
    }
    case 'UPDATE_ACTIVE_STEP': {
      return { ...state, active_step: action.payload }
    }
    default: {
      return state
    }
  }
}
