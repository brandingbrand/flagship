import StepManager from '../src/StepManager';
import type { Step } from '../src/types';

describe('StepManager', () => {
  it('get active step', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
    ]);

    const activeStep = stepManager.getActive();

    expect(activeStep && activeStep.name).toBe('step1');
  });

  it('get active step if no active step', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'pending' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
    ]);

    const activeStep = stepManager.getActive();

    expect(activeStep).toBeUndefined();
  });

  it('get next active step', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
    ]);

    const nextActiveStep = stepManager.getNextActive();

    expect(nextActiveStep && nextActiveStep.name).toBe('step2');
  });

  it('get next active step when next step is done', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'done' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    const nextActiveStep = stepManager.getNextActive();

    expect(nextActiveStep && nextActiveStep.name).toBe('step3');
  });

  it('get next active step when all step are done', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'done' },
      { name: 'step2', displayName: 'step 2', status: 'done' },
      { name: 'step3', displayName: 'step 3', status: 'done' },
    ]);

    const nextActiveStep = stepManager.getNextActive();

    expect(nextActiveStep).toBeUndefined();
  });

  it('continue step', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.continue();

    expect(stepManager.steps[0]?.status).toBe('done');
    expect(stepManager.steps[1]?.status).toBe('active');
  });

  it('continue step when next step is done', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'done' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.continue();

    expect(stepManager.steps[0]?.status).toBe('done');
    expect(stepManager.steps[1]?.status).toBe('done');
    expect(stepManager.steps[2]?.status).toBe('active');
  });

  it('continue step when all step are done', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'done' },
      { name: 'step2', displayName: 'step 2', status: 'done' },
      { name: 'step3', displayName: 'step 3', status: 'done' },
    ]);

    try {
      stepManager.continue();
    } catch (error: any) {
      expect(error.message).toBeTruthy();
    }
  });

  it('goTo step', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'done' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.goTo('step2');

    expect(stepManager.steps[0]?.status).toBe('pending');
    expect(stepManager.steps[1]?.status).toBe('active');
    expect(stepManager.steps[2]?.status).toBe('pending');
  });

  it('goTo step when the step is not done', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    try {
      stepManager.goTo('step2');
    } catch (error: any) {
      expect(error.message).toBeTruthy();
    }
  });

  it('back step', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'done' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.continue();
    stepManager.back();

    expect(stepManager.steps[0]?.status).toBe('active');
    expect(stepManager.steps[1]?.status).toBe('done');
  });

  it('back step once after continue twice', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.continue();
    stepManager.continue();
    stepManager.back();

    expect(stepManager.steps[0]?.status).toBe('done');
    expect(stepManager.steps[1]?.status).toBe('active');
    expect(stepManager.steps[2]?.status).toBe('pending');
  });

  it('back step when there is no history', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.back();

    expect(stepManager.steps[0]?.status).toBe('active');
    expect(stepManager.steps[1]?.status).toBe('pending');
    expect(stepManager.steps[2]?.status).toBe('pending');
  });

  it('set steps', () => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.setSteps({
      done: ['step1', 'step2'],
      active: ['step3'],
    });

    expect(stepManager.steps[0]?.status).toBe('done');
    expect(stepManager.steps[1]?.status).toBe('done');
    expect(stepManager.steps[2]?.status).toBe('active');
  });

  it('onChange on continue', (done) => {
    const stepManager = new StepManager([
      { name: 'step1', displayName: 'step 1', status: 'active' },
      { name: 'step2', displayName: 'step 2', status: 'pending' },
      { name: 'step3', displayName: 'step 3', status: 'pending' },
    ]);

    stepManager.onChange((nextSteps: Step[]) => {
      expect(nextSteps[0]?.status).toBe('done');
      expect(nextSteps[1]?.status).toBe('active');
      expect(nextSteps[2]?.status).toBe('pending');

      done();
    });

    stepManager.continue();
  });
});
