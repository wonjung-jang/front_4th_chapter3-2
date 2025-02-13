import { expect, test } from '@playwright/test';

test('반복 일정 생성', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: '제목' }).fill('캠핑');

  await page.getByRole('textbox', { name: '날짜' }).fill('2025-02-01');
  await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
  await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');

  await page.getByRole('textbox', { name: '설명' }).fill('굴업도 2박3일 백패킹');

  await page.getByRole('textbox', { name: '위치' }).fill('굴업도');

  await page.getByRole('combobox', { name: '카테고리' }).selectOption('개인');

  await page.locator('span').first().click();

  await page.getByRole('combobox', { name: '반복 유형' }).selectOption('매일');
  await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-02-03');

  await page.getByTestId('event-submit-button').click();

  await expect(page.getByText('일정이 추가되었습니다.')).toBeVisible();
});

test.afterEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');

  const eventList = page.getByTestId('event-list');
  const targetEvents = eventList.locator('div[role="event"]').filter({ hasText: '캠핑' });

  const targetEventCount = await targetEvents.count();

  for (let i = targetEventCount - 1; i >= 0; i--) {
    const event = targetEvents.nth(i);
    const deleteButton = event.locator('button[aria-label="Delete event"]');
    await deleteButton.click();
  }
});
