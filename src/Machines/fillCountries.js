import { assign } from "xstate";
import { fetchCountries } from "../utils/api";

const fillCountries = {
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "getCountries",
        src: () => fetchCountries,
        onDone: {
          target: "success",
          actions: assign({
            countries: (context, event) => event.data,
          }),
        },
        onError: {
          target: "failure",
          actions: assign({
            error: "Fallo el request",
          }),
        },
      },
    },
    success: {},
    failure: {
      on: {
        RETRY: { target: "loading" },
      },
    },
  },
};

export default fillCountries;
