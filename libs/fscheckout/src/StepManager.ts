/**
 * This module is responsible for maintaining checkout step status by:
 * - Tracking what the current and next steps are
 * - Tracking step history
 * - Providing the interface to get/update steps
 * - Provider hooks for steps change
 */

import type { Step, StepStatus } from './types';

export type StepListener = (nextSteps: Step[]) => void;
export type StatusUpdates = { [status in StepStatus]?: string[] };

export default class StepManager {
  constructor(public steps: Step[] = []) {}

  private readonly history: Step[][] = [];
  private readonly listeners: StepListener[] = [];

  public back(): Step[] | undefined {
    const nextStepsState = this.history.pop();

    if (nextStepsState) {
      this.steps = nextStepsState;
      for (const listener of this.listeners) {
        listener(nextStepsState);
      }
    }

    return nextStepsState;
  }

  public onChange(listener: StepListener): void {
    this.listeners.push(listener);
  }

  public getActive(): Step | undefined {
    return this.steps.find((step) => step.status === 'active');
  }

  public getNextActive(): Step {
    // try find step is not done or active, but previous is active
    let nextActiveStepIndex = this.steps.findIndex(
      (s, i) =>
        s.status !== 'done' &&
        s.status !== 'active' &&
        this.steps[i - 1] &&
        this.steps[i - 1]?.status === 'active'
    );

    // try find step is not done or active, but previous is done
    if (nextActiveStepIndex === -1) {
      nextActiveStepIndex = this.steps.findIndex(
        (s, i) =>
          s.status !== 'done' &&
          s.status !== 'active' &&
          this.steps[i - 1] &&
          this.steps[i - 1]?.status === 'done'
      );
    }

    return this.steps[nextActiveStepIndex] as Step;
  }

  public continue(): void {
    const activeStep = this.getActive();
    const nextActiveStep = this.getNextActive();

    if (!activeStep || !nextActiveStep || activeStep.name === nextActiveStep.name) {
      throw new Error('FSCheckout: cannot find next step');
    }

    this.setSteps({
      done: [activeStep.name],
      active: [nextActiveStep.name],
    });
  }

  public goTo(stepName: string): void {
    const stepToBeActive = this.steps.find(
      (step) => step.name === stepName && step.status === 'done'
    );

    if (!stepToBeActive) {
      throw new Error(
        `FSCheckout: you can only goTo step with status done.` +
          ` ${stepName}'s status is not done or doesn't exist`
      );
    }

    const activeStepNames = this.steps
      .filter((step) => step.status === 'active')
      .map((step) => step.name);

    this.setSteps({
      pending: activeStepNames,
      active: [stepToBeActive.name],
    });
  }

  public setSteps(statusUpdates: StatusUpdates): Step[] {
    const nextStepsState = [...this.steps];

    for (const [i, step] of nextStepsState.entries()) {
      for (const status of Object.keys(statusUpdates)) {
        const _status = status as StepStatus;
        const updates = statusUpdates[_status] || [];

        for (const _step of updates) {
          if (step.status !== _status && _step === step.name) {
            nextStepsState[i] = {
              ...step,
              status: _status,
            };
          }
        }
      }
    }

    this.history.push(this.steps);
    this.steps = nextStepsState;
    for (const listener of this.listeners) {
      listener(nextStepsState);
    }

    return nextStepsState;
  }
}
