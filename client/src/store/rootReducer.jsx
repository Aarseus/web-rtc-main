import { combineReducers } from 'redux';
import { PURGE } from 'redux-persist';

import webRtcReducers from './slices/webRtcSlice';


const appReducer=combineReducers({
    webRtcReducers
})

const rootReducer = (state, action) => {
    let tempState = state;
    if (action.type === PURGE) {
      tempState = undefined;
    }
    return appReducer(tempState, action);
  };
  
  export default rootReducer;
  export { rootReducer };