export type StepStatus = 'pending' | 'active' | 'done';
export interface Step {
  name: string;
  displayName: string;
  status: StepStatus;
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
