import { IsMessageNotificationExistPipe } from './is-message-notification-exist.pipe';

describe('IsMessageNotificationExistPipe', () => {
  it('create an instance', () => {
    const pipe = new IsMessageNotificationExistPipe();
    expect(pipe).toBeTruthy();
  });
});
