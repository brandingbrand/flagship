import { Step } from '../src/types';
import StepManager from '../src/StepManager';

test('get active step', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
  ]);

  const activeStep = stepManager.getActive();
  expect(activeStep && activeStep.name).toBe('step1');
});

test('get active step if no active step', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'pending' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
  ]);

  const activeStep = stepManager.getActive();
  expect(activeStep).toBe(undefined);
});

test('get next active step', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
  ]);

  const nextActiveStep = stepManager.getNextActive();
  expect(nextActiveStep && nextActiveStep.name).toBe('step2');
});

test('get next active step when next step is done', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'done' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  const nextActiveStep = stepManager.getNextActive();
  expect(nextActiveStep && nextActiveStep.name).toBe('step3');
});

test('get next active step when all step are done', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'done' },
    { name: 'step2', displayName: 'step 2', status: 'done' },
    { name: 'step3', displayName: 'step 3', status: 'done' },
  ]);

  const nextActiveStep = stepManager.getNextActive();
  expect(nextActiveStep).toBe(undefined);
});

test('continue step', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.continue();
  expect(stepManager.steps[0].status).toBe('done');
  expect(stepManager.steps[1].status).toBe('active');
});

test('continue step when next step is done', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'done' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.continue();
  expect(stepManager.steps[0].status).toBe('done');
  expect(stepManager.steps[1].status).toBe('done');
  expect(stepManager.steps[2].status).toBe('active');
});

test('continue step when all step are done', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'done' },
    { name: 'step2', displayName: 'step 2', status: 'done' },
    { name: 'step3', displayName: 'step 3', status: 'done' },
  ]);

  try {
    stepManager.continue();
  } catch (e) {
    expect(e.message).toBeTruthy();
  }
});

test('goTo step', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'done' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.goTo('step2');
  expect(stepManager.steps[0].status).toBe('pending');
  expect(stepManager.steps[1].status).toBe('active');
  expect(stepManager.steps[2].status).toBe('pending');
});

test('goTo step when the step is not done', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  try {
    stepManager.goTo('step2');
  } catch (e) {
    expect(e.message).toBeTruthy();
  }
});

test('back step', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'done' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.continue();
  stepManager.back();
  expect(stepManager.steps[0].status).toBe('active');
  expect(stepManager.steps[1].status).toBe('done');
});

test('back step once after continue twice', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.continue();
  stepManager.continue();
  stepManager.back();
  expect(stepManager.steps[0].status).toBe('done');
  expect(stepManager.steps[1].status).toBe('active');
  expect(stepManager.steps[2].status).toBe('pending');
});

test('back step when there is no history', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.back();
  expect(stepManager.steps[0].status).toBe('active');
  expect(stepManager.steps[1].status).toBe('pending');
  expect(stepManager.steps[2].status).toBe('pending');
});

test('set steps', () => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.setSteps({
    done: ['step1', 'step2'],
    active: ['step3'],
  });
  expect(stepManager.steps[0].status).toBe('done');
  expect(stepManager.steps[1].status).toBe('done');
  expect(stepManager.steps[2].status).toBe('active');
});

test('onChange on continue', (done) => {
  const stepManager = new StepManager([
    { name: 'step1', displayName: 'step 1', status: 'active' },
    { name: 'step2', displayName: 'step 2', status: 'pending' },
    { name: 'step3', displayName: 'step 3', status: 'pending' },
  ]);

  stepManager.onChange((nextSteps: Step[]) => {
    expect(nextSteps[0].status).toBe('done');
    expect(nextSteps[1].status).toBe('active');
    expect(nextSteps[2].status).toBe('pending');
    done();
  });

  stepManager.continue();
});
