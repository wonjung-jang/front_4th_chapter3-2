import { EventForm } from '../../types';
import { generateRepeatingEvents } from '../../utils/generateRepeatingEvents';

describe('generateRepeatingEvents', () => {
  it('반복 옵션을 넣은 이벤트 정보를 넣어주면 EventForm 배열을 반환한다.', () => {
    const eventData: EventForm = {
      title: '매일 반복 테스트',
      date: '2024-10-01',
      startTime: '20:00',
      endTime: '21:00',
      description: '',
      location: '',
      category: '개인',
      repeat: {
        type: 'daily',
        interval: 1,
        endCondition: 'count',
        count: 3,
      },
      notificationTime: 10,
    };

    const result = generateRepeatingEvents(eventData);

    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBe(3);
    expect(result[0].date).toBe('2024-10-01');
    expect(result[1].date).toBe('2024-10-02');
    expect(result[2].date).toBe('2024-10-03');
  });
});
