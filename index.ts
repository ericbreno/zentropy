export type Reducer<T> = (state: T, payload?: any) => T;
export type Reducers<T, RK extends string> = {
  [Action in RK]: Reducer<T>;
};

export type Listener<T> = (value: T) => void;
export type Listeners<T> = Set<Listener<T>>;
export type Middleware<T> = (state: T, action: string, payload?: any) => void;

export interface MakeProps<T, RK extends string> {
  initial: T;
  reducers?: Record<RK, Reducer<T>>;
}

export class State<T, RK extends string> {
  private initialState: T;
  private state: T;

  private listeners: Listeners<T> = new Set();
  private reducers: Reducers<T, RK>;

  private middlewares: Set<Middleware<T>> = new Set();

  constructor({ initial, reducers = {} as any }: MakeProps<T, RK>) {
    this.initialState = initial;
    this.state = initial;
    this.reducers = reducers;
  }

  get value(): T {
    return this.state;
  }

  subscribe(fn: Listener<T>): () => void {
    this.listeners.add(fn);

    return () => this.listeners.delete(fn);
  }

  unsubscribe(fn: Listener<T>): void {
    this.listeners.delete(fn);
  }

  update(updated: T): T {
    this.state = updated;
    this.listeners.forEach(fn => fn(updated));
    return updated;
  }

  dispatch(action: RK, payload?: any): void {
    const reducer = this.reducers[action];
    if (!reducer) {
      console.error(`Reducer ${action} not found`);
      return;
    }
    const updated = reducer(this.state, payload);

    this.middlewares.forEach(mw => mw(updated, action, payload));

    this.update(updated);
  }

  reset(): void {
    this.update(this.initialState);
  }

  use(middleware: Middleware<T>): () => void {
    this.middlewares.add(middleware);

    return () => this.middlewares.delete(middleware);
  }

  get actions(): Record<RK, (payload?: any) => void> {
    return (Object.keys(this.reducers) as RK[]).reduce((acc, action) => {
      acc[action] = (payload) => this.dispatch(action, payload);
      return acc;
    }, {} as Record<RK, (payload?: any) => void>);
  }
}

export function makeState<T, ReducerKey extends string>(
  props: MakeProps<T, ReducerKey>
) {
  return new State(props);
}

export default State;
