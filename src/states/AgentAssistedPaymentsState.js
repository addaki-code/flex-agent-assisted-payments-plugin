const ACTION_INITIATE_PAYMENT = 'INITIATE_PAYMENT';

const initialState = {
  isOpen: true,
};

export class Actions {
  static initiatePayment = () => ({ type: ACTION_INITIATE_PAYMENT });
}

export function reduce(state = initialState, action) {
  switch (action.type) {
    case ACTION_INITIATE_PAYMENT: {
      return {
        ...state,
        isOpen: false,
      };
    }

    default:
      return state;
  }
}
