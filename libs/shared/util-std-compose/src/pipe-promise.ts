export function pipePromise<A>(a: A | Promise<A>): Promise<A>;
export function pipePromise<A, B>(a: A | Promise<A>, ab: (a: A) => B | Promise<B>): Promise<B>;
export function pipePromise<A, B, C>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>
): Promise<C>;
export function pipePromise<A, B, C, D>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>
): Promise<D>;
export function pipePromise<A, B, C, D, E>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>
): Promise<E>;
export function pipePromise<A, B, C, D, E, F>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>
): Promise<F>;
export function pipePromise<A, B, C, D, E, F, G>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>
): Promise<G>;
export function pipePromise<A, B, C, D, E, F, G, H>(
  a: A | Promise<A>,
  ab: (a: A) => A | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>
): Promise<H>;
export function pipePromise<A, B, C, D, E, F, G, H, I>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>
): Promise<I>;
export function pipePromise<A, B, C, D, E, F, G, H, I, J>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>
): Promise<J>;
export function pipePromise<A, B, C, D, E, F, G, H, I, J, K>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>
): Promise<K>;
export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>
): Promise<L>;
export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>
): Promise<M>;
export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>,
  mn: (m: M) => N | Promise<N>
): Promise<N>;
export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>,
  mn: (m: M) => N | Promise<N>,
  no: (n: N) => O | Promise<O>
): Promise<O>;

export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>,
  mn: (m: M) => N | Promise<N>,
  no: (n: N) => O | Promise<O>,
  op: (o: O) => P | Promise<P>
): Promise<P>;

export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>,
  mn: (m: M) => N | Promise<N>,
  no: (n: N) => O | Promise<O>,
  op: (o: O) => P | Promise<P>,
  pq: (p: P) => Promise<Q> | Q
): Promise<Q>;

export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>,
  mn: (m: M) => N | Promise<N>,
  no: (n: N) => O | Promise<O>,
  op: (o: O) => P | Promise<P>,
  pq: (p: P) => Promise<Q> | Q,
  qr: (q: Q) => Promise<R> | R
): Promise<R>;

export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>,
  mn: (m: M) => N | Promise<N>,
  no: (n: N) => O | Promise<O>,
  op: (o: O) => P | Promise<P>,
  pq: (p: P) => Promise<Q> | Q,
  qr: (q: Q) => Promise<R> | R,
  rs: (r: R) => Promise<S> | S
): Promise<S>;

export function pipePromise<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
  a: A | Promise<A>,
  ab: (a: A) => B | Promise<B>,
  bc: (b: B) => C | Promise<C>,
  cd: (c: C) => D | Promise<D>,
  de: (d: D) => E | Promise<E>,
  ef: (e: E) => F | Promise<F>,
  fg: (f: F) => G | Promise<G>,
  gh: (g: G) => H | Promise<H>,
  hi: (h: H) => I | Promise<I>,
  ij: (i: I) => J | Promise<J>,
  jk: (j: J) => K | Promise<K>,
  kl: (k: K) => L | Promise<L>,
  lm: (l: L) => M | Promise<M>,
  mn: (m: M) => N | Promise<N>,
  no: (n: N) => O | Promise<O>,
  op: (o: O) => P | Promise<P>,
  pq: (p: P) => Promise<Q> | Q,
  qr: (q: Q) => Promise<R> | R,
  rs: (r: R) => Promise<S> | S,
  st: (s: S) => Promise<T> | T
): Promise<T>;
export function pipePromise<InputType>(
  value: InputType,
  ...functions: Array<(input: InputType) => InputType | Promise<InputType>>
): Promise<InputType>;
/**
 *
 * @param value
 * @param functions
 */
export async function pipePromise(
  value: Promise<unknown> | unknown,
  ...functions: Array<(input: unknown) => Promise<unknown> | unknown>
): Promise<unknown> {
  return functions.reduce(async (val, fn) => await fn(val), await value);
}
