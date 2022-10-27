export default function rootReducer(state={mode: false}, action){
    switch(action.type){      
       case "CHANGE_MODE":      
          var mode = !state.mode        
          return {...state, mode}      
       default:        
          return state    
     }   
 }