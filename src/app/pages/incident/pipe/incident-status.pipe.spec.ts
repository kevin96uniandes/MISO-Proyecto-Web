import { IncidentStatusPipe } from './incident-status.pipe';

describe('IncidentStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new IncidentStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
