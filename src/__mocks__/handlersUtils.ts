import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event, EventForm } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    }),
    http.post('/api/events-list', async ({ request }) => {
      const body = (await request.json()) as Record<string, any>;
      if (!body || !body.events) {
        return new HttpResponse(null, { status: 400 });
      }
      const newEvents = body.events as EventForm[];

      const repeatId = String(mockEvents.length + 1);
      const processedEvents = newEvents.map((event: EventForm, index: number) => {
        const isRepeatEvent = event.repeat?.type !== 'none';
        return {
          id: String(mockEvents.length + index + 1),
          ...event,
          repeat: {
            ...event.repeat,
            id: isRepeatEvent ? repeatId : undefined,
          },
        };
      });

      mockEvents.push(...processedEvents);

      return HttpResponse.json(processedEvents, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2024-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무 회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
    {
      id: 'ae576733-64b5-41ab-9052-e7222d4b0f71',
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
        endDate: '2024-10-03',
        count: 3,
        id: 'b59f8067-4e19-4096-92c7-fca97238cae3',
      },
      notificationTime: 10,
    },
    {
      id: 'b3d0526a-c3bc-42c2-8131-78f15128ff8b',
      title: '매일 반복 테스트',
      date: '2024-10-02',
      startTime: '20:00',
      endTime: '21:00',
      description: '',
      location: '',
      category: '개인',
      repeat: {
        type: 'daily',
        interval: 1,
        endCondition: 'count',
        endDate: '2024-10-03',
        count: 3,
        id: 'b59f8067-4e19-4096-92c7-fca97238cae3',
      },
      notificationTime: 10,
    },
    {
      id: 'ed7c99dd-8b74-48f4-9ef7-28d7e9d91af4',
      title: '매일 반복 테스트',
      date: '2024-10-03',
      startTime: '20:00',
      endTime: '21:00',
      description: '',
      location: '',
      category: '개인',
      repeat: {
        type: 'daily',
        interval: 1,
        endCondition: 'count',
        endDate: '2024-10-03',
        count: 3,
        id: 'b59f8067-4e19-4096-92c7-fca97238cae3',
      },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2024-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};
