import { combineReducers } from 'redux';
import { PURGE } from 'redux-persist';

import videoReducers from './slices/videoSlice';


const appReducer=combineReducers({
    videoReducers
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