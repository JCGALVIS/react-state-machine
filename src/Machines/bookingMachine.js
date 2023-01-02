import { assign, createMachine } from "xstate";
import fillCountries from "./fillCountries";

const bookingMachine = createMachine(
  {
    id: "buy plane tickets",
    initial: "initial",
    context: {
      passengers: [],
      selectedCountry: "",
      countries: [],
      error: "",
    },
    states: {
      initial: {
        on: {
          START: {
            target: "search",
          },
        },
      },
      search: {
        on: {
          CONTINUE: {
            target: "passengers",
            actions: assign({
              selectedCountry: (context, event) => event.selectedCountry,
            }),
          },
          CANCEL: "initial",
        },
        ...fillCountries,
      },
      tickets: {
        after: {
          5000: {
            target: "initial",
            actions: "clearContext",
          },
        },
        on: {
          FINISH: "initial",
        },
      },
      passengers: {
        on: {
          DONE: {
            target: "tickets",
            cond: "moreThanOnePassengers",
          },
          CANCEL: {
            target: "initial",
            actions: "clearContext",
          },
          ADD: {
            target: "passengers",
            actions: assign((context, event) =>
              context.passengers.push(event.newPassengers)
            ),
          },
        },
      },
    },
  },
  {
    actions: {
      clearContext: assign({
        selectedCountry: "",
        passengers: [],
      }),
    },
    guards: {
      moreThanOnePassengers: (context) => {
        return context.passengers.length > 0;
      },
    },
  }
);

export default bookingMachine;
