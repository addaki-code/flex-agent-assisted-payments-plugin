const UPDATE_SYNC_PAYMENT_SID = "UPDATE_SYNC_PAYMENT_SID";
const SHOW_VOICE_PAYMENT_FORM = "SHOW_VOICE_PAYMENT_FORM";
const HIDE_VOICE_PAYMENT_FORM = "HIDE_VOICE_PAYMENT_FORM";

const initialState = {
    syncPaymentSid: {
        token: null,
        sid: null,
        subscribeSync: false,
    },
    showVoicePaymentForm: false,
};

// Define plugin actions
export class Actions {
    static updateSyncPaymentSid = (payload) => ({
        type: UPDATE_SYNC_PAYMENT_SID,
        payload: payload,
    });
    static showVoicePaymentForm = () => ({
        type: SHOW_VOICE_PAYMENT_FORM,
    });

    static hideVoicePaymentForm = () => ({
        type: HIDE_VOICE_PAYMENT_FORM,
    });
}

// Define how actions influence state
export function reduce(state = initialState, action) {
    switch (action.type) {
        case UPDATE_SYNC_PAYMENT_SID: {
            return {
                ...state,
                syncPaymentSid: action.payload,
            };
        }
        
        case SHOW_VOICE_PAYMENT_FORM: {
            return {
                ...state,
                showVoicePaymentForm: true,
            };
        }

        case HIDE_VOICE_PAYMENT_FORM: {
            return {
                ...state,
                showVoicePaymentForm: false,
            };
        }

        default:
            return state;
    }
}
