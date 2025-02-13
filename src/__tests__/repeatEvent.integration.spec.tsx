import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, within } from '@testing-library/react';
import userEvent, { UserEvent } from '@testing-library/user-event';
import { ReactElement } from 'react';

import { setupMockHandlerCreation, setupMockHandlerUpdating } from '../__mocks__/handlersUtils';
import App from '../App';
import { Event } from '../types';

const setup = (element: ReactElement) => {
  const user = userEvent.setup();

  return { ...render(<ChakraProvider>{element}</ChakraProvider>), user }; // ? Med: 왜 ChakraProvider로 감싸는지 물어보자
};

const saveSchedule = async (user: UserEvent, form: Omit<Event, 'id' | 'notificationTime'>) => {
  const { title, date, startTime, endTime, location, description, category, repeat } = form;
  const { type, interval, endCondition, endDate, count } = repeat;

  await user.click(screen.getAllByText('일정 추가')[0]);

  await user.type(screen.getByLabelText('제목'), title);
  await user.type(screen.getByLabelText('날짜'), date);
  await user.type(screen.getByLabelText('시작 시간'), startTime);
  await user.type(screen.getByLabelText('종료 시간'), endTime);
  await user.type(screen.getByLabelText('설명'), description);
  await user.type(screen.getByLabelText('위치'), location);
  await user.selectOptions(screen.getByLabelText('카테고리'), category);

  await user.click(screen.getByLabelText('반복 설정'));

  await user.selectOptions(screen.getByLabelText('반복 유형'), type);
  const intervalInput = screen.getByLabelText('반복 간격');
  await user.clear(intervalInput);
  await user.type(intervalInput, interval.toString());

  const endConditionSelect = screen.getByRole('radio', {
    name:
      endCondition === 'endDate'
        ? '종료일 지정'
        : endCondition === 'count'
          ? '횟수 지정'
          : '조건 없음',
  });
  await user.click(endConditionSelect);
  if (endCondition === 'endDate') {
    const endDateInput = screen.getByLabelText('반복 종료일');
    await user.clear(endDateInput);
    await user.type(endDateInput, endDate ?? '');
  }
  if (endCondition === 'count') {
    const countInput = screen.getByLabelText('반복 종료 횟수');
    await user.clear(countInput);
    await user.type(countInput, count?.toString() ?? '');
  }

  await user.click(screen.getByTestId('event-submit-button'));
};

describe('반복 유형 선택', () => {
  it('일정 생성 시 반복 유형을 선택할 수 있다.', async () => {
    const { user } = setup(<App />);

    await user.click(screen.getByLabelText('반복 설정'));
    const repeatSelect = screen.getByLabelText('반복 유형');

    expect(repeatSelect).toBeInTheDocument();

    const options = [...repeatSelect.children];
    expect(options.length).toBe(4);

    const optionsValue = options.map((option) => option.textContent);
    expect(optionsValue).toContain('매일');
    expect(optionsValue).toContain('매주');
    expect(optionsValue).toContain('매월');
    expect(optionsValue).toContain('매년');
  });

  it('일정 수정 시 반복 유형을 선택할 수 있다.', async () => {
    const { user } = setup(<App />);

    const editButton = await screen.findByLabelText('Edit event');
    await user.click(editButton);

    const repeatSetting = await screen.findByLabelText('반복 설정');
    await user.click(repeatSetting);

    const repeatSelect = screen.getByLabelText('반복 유형');

    expect(repeatSelect).toBeInTheDocument();

    const options = [...repeatSelect.children];
    expect(options.length).toBe(4);

    const optionsValue = options.map((option) => option.textContent);
    expect(optionsValue).toContain('매일');
    expect(optionsValue).toContain('매주');
    expect(optionsValue).toContain('매월');
    expect(optionsValue).toContain('매년');
  });
});

describe('반복 일정 생성', () => {
  it('사용자가 반복 조건을 종료일로 설정 후 반복 일정을 생성할 수 있어야 한다.', async () => {
    setupMockHandlerCreation();
    const { user } = setup(<App />);

    await saveSchedule(user, {
      title: '주간 팀 회의',
      date: '2024-07-01',
      startTime: '10:00',
      endTime: '11:00',
      location: '회의실 A',
      description: '주간 업무 보고 및 계획 수립',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 1,
        endCondition: 'endDate',
        endDate: '2024-12-31',
      },
    });

    const eventList = within(screen.getByTestId('event-list'));

    const events = await eventList.findAllByText('주간 팀 회의');
    const repeatInfo = await eventList.findAllByText('반복: 1주마다 (종료: 2024-12-31)');

    expect(events.length).toBeGreaterThan(0);
    expect(repeatInfo.length).toBeGreaterThan(0);
  });

  it('사용자가 반복 조건을 횟수로 설정 후 반복 일정을 생성할 수 있어야 한다.', async () => {
    setupMockHandlerCreation();
    const { user } = setup(<App />);

    await saveSchedule(user, {
      title: '주간 팀 회의',
      date: '2024-10-01',
      startTime: '10:00',
      endTime: '11:00',
      location: '회의실 A',
      description: '주간 업무 보고 및 계획 수립',
      category: '업무',
      repeat: {
        type: 'weekly',
        interval: 1,
        endCondition: 'count',
        count: 3,
      },
    });

    const eventList = within(screen.getByTestId('event-list'));

    const events = await eventList.findAllByText('주간 팀 회의');
    const repeatInfo = await eventList.findAllByText('반복: 1주마다 (종료: 2024-10-15)');

    expect(events.length).toBe(3);
    expect(repeatInfo.length).toBe(3);
  });
});

describe('반복 일정 수정', () => {
  it('사용자가 반복 일정을 수정하면 해당 일정은 단일 일정으로 변경된다.', async () => {
    setupMockHandlerUpdating();
    const { user } = setup(<App />);

    const editButtons = await screen.findAllByLabelText('Edit event');
    const editButton = editButtons[editButtons.length - 1];

    await user.click(editButton);

    await user.clear(screen.getByLabelText('제목'));
    await user.type(screen.getByLabelText('제목'), '반복 일정 아니지롱');
    await user.clear(screen.getByLabelText('설명'));
    await user.type(screen.getByLabelText('설명'), '단일 일정이지롱');

    await user.click(screen.getByTestId('event-submit-button'));

    const eventList = within(screen.getByTestId('event-list'));
    const updatedEvent = eventList.getByText('반복 일정 아니지롱').closest('div[role="event"]');

    expect(updatedEvent).not.toBeNull();
    expect(within(updatedEvent as HTMLElement).getByText('단일 일정이지롱')).toBeInTheDocument();
    expect(
      within(updatedEvent as HTMLElement).queryByText('반복: 1일마다 (종료: 2024-10-03)')
    ).not.toBeInTheDocument();
  });
});
