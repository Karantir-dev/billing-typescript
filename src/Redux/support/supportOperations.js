import qs from 'qs'
import supportActions from './supportActions'
import { axiosInstance } from '../../config/axiosInstance'

const getTicketsHandler = (body = {}) => (dispatch, getState) => {
  const {
    auth: { sessionId },
  } = getState()
  
  axiosInstance
    .post(
      '/',
      qs.stringify({
        func: 'clientticket',
        sok: 'ok',
        out: 'json',
        auth: sessionId,
        p_cnt: 30,
        p_col: '+time',
        clickstat: 'yes',
        ...body
      }),
    )
    .then(({ data }) => {
      if (data.doc.error) {
        throw new Error(data.doc.error.msg.$)
      }
      const elem = data?.doc?.elem || [];
      dispatch(supportActions.getTickets(elem))
      const count = data?.doc?.p_elems?.$ || 0
      dispatch(supportActions.getTicketCount(count))
    })
    .catch(error => {
      console.log('support -', error.message)
    })
}

export default {
  getTicketsHandler
}
