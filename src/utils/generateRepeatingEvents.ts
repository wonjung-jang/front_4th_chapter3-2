import { EventForm } from '../types';

export function generateRepeatingEvents(eventData: EventForm) {
  const { type, interval, endDate, endCondition, count } = eventData.repeat!;
  const startDate = new Date(eventData.date);
  const endRepeatDate = endDate ? new Date(endDate) : null;

  let generatedEvents: EventForm[] = [];
  let currentDate = new Date(startDate);
  let occurrenceCount = 0;

  while (
    (!endRepeatDate || currentDate <= endRepeatDate) &&
    (endCondition !== 'count' || occurrenceCount < (count || 0))
  ) {
    generatedEvents.push({
      ...eventData,
      date: currentDate.toISOString().split('T')[0],
    });

    switch (type) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + interval * 7);
        break;
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;
    }

    occurrenceCount++;
  }

  if (endCondition === 'count' && generatedEvents.length > 0) {
    const lastEventDate = generatedEvents[generatedEvents.length - 1].date;
    eventData.repeat.endDate = lastEventDate;
  }

  return generatedEvents;
}
