export default function Errs(state = [], action) {
   switch (action.type) {
      case 'SIGN_IN_ERR':
         return action.details;
      case 'REGISTER_ERR':
         return action.details;
      case 'CLOSE_ERR':
         return {}
      case 'DUP_CNV_ERR':
         return action.details;
      case 'MISSING_MSG_ERR':
         return action.details;
      case 'BAD_ADDRESS_ERROR':
          return action.details;
      default:
         return state;
   }
}
