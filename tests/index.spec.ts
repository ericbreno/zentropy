import State, { makeState } from '../src/zentropy';

type Person = {
  name: string;
  email: string;
  online: boolean;
}

const makePerson = (): Person => ({
  name: 'Evrick',
  email: 'evrick@state.com',
  online: false
});

describe('State class should', () => {
  test('create state object correctly', () => {
    const initial = makePerson();
    const state = new State({ initial });

    expect(state.value).toBe(initial);
  });

  test('call subscribers on change', () => {
    const initial = makePerson();
    const state = new State({ initial });

    const sub1 = jest.fn();
    const sub2 = jest.fn();

    state.subscribe(sub1);
    state.subscribe(sub2);

    expect(sub1).not.toHaveBeenCalled();
    expect(sub2).not.toHaveBeenCalled();

    const updated = {
      ...initial,
      name: 'Eric'
    }
    state.update(updated);
    expect(state.value).toBe(updated);

    expect(sub1).toHaveBeenCalledTimes(1);
    expect(sub2).toHaveBeenCalledTimes(1);
    expect(sub1).toHaveBeenCalledWith(updated);
    expect(sub2).toHaveBeenCalledWith(updated);
  });

  test('call subscriber on reducer call', () => {
    const initial = makePerson();
    const state = new State({
      initial,
      reducers: {
        login: (state) => {
          return { ...state, online: true };
        },
        logout: (state) => {
          return { ...state, online: false };
        }
      }
    });

    const sub1 = jest.fn();
    state.subscribe(sub1);

    expect(state.value.online).toBeFalsy();

    state.actions.login();
    expect(state.value.online).toBeTruthy();
    expect(sub1).toHaveBeenCalledTimes(1);
    expect(sub1).toHaveBeenCalledWith(state.value);

    state.actions.logout();
    expect(state.value.online).toBeFalsy();
    expect(sub1).toHaveBeenCalledTimes(2);
    expect(sub1).toHaveBeenCalledWith(state.value);
  });

  test('call subscriber on dispatch', () => {
    const initial = makePerson();
    const state = new State({
      initial,
      reducers: {
        login: (state) => {
          return { ...state, online: true };
        },
        logout: (state) => {
          return { ...state, online: false };
        }
      }
    });

    const sub1 = jest.fn();
    state.subscribe(sub1);

    expect(state.value.online).toBeFalsy();

    state.dispatch('login');
    expect(state.value.online).toBeTruthy();
    expect(sub1).toHaveBeenCalledTimes(1);
    expect(sub1).toHaveBeenCalledWith(state.value);

    state.dispatch('logout');
    expect(state.value.online).toBeFalsy();
    expect(sub1).toHaveBeenCalledTimes(2);
    expect(sub1).toHaveBeenCalledWith(state.value);
  });

  test('have all reducers available correctly', () => {
    const state = makeState({
      initial: 1,
      reducers: {
        a: t => t,
        b: t => t,
        c: t => t,
        d: t => t,
      }
    })

    expect(state.actions).toHaveProperty('a');
    expect(state.actions).toHaveProperty('b');
    expect(state.actions).toHaveProperty('c');
    expect(state.actions).toHaveProperty('d');
  });

  test('unsubscribe callback correctly', () => {
    const initial = makePerson();
    const state = new State({ initial });

    const sub1 = jest.fn();
    const sub2 = jest.fn();

    state.subscribe(sub1);
    state.subscribe(sub2);

    expect(sub1).not.toHaveBeenCalled();
    expect(sub2).not.toHaveBeenCalled();

    state.unsubscribe(sub2);

    const updated = {
      ...initial,
      name: 'Eric'
    }
    state.update(updated);
    expect(state.value).toBe(updated);

    expect(sub1).toHaveBeenCalledTimes(1);
    expect(sub1).toHaveBeenCalledWith(updated);

    expect(sub2).not.toHaveBeenCalled();
  })

  test("apply middleware functions", () => {
    const logger = jest.fn();
    const state = makeState({
      initial: 0,
      reducers: {
        increment: (state) => state + 1,
      },
    });

    const unsub = state.use(logger);
    state.dispatch("increment");
    expect(logger).toHaveBeenCalledWith(1, "increment", undefined);

    unsub();

    state.dispatch("increment");
    expect(logger).toHaveBeenCalledTimes(1);
  });

  test("not dispatch unknown actions", () => {
    console.error = jest.fn();
    const state = makeState({ initial: 0 });
    state.dispatch("unknownAction");
    expect(console.error).toHaveBeenCalledWith("Reducer unknownAction not found");
  });
});
