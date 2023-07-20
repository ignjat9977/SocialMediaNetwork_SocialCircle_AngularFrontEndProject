import { VideoOrPhotoPipe } from './video-or-photo.pipe';

describe('VideoOrPhotoPipe', () => {
  it('create an instance', () => {
    const pipe = new VideoOrPhotoPipe();
    expect(pipe).toBeTruthy();
  });
});
