import { test } from '@playwright/test';

test('반복 일정 생성', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('textbox', { name: '제목' }).click();
  await page.getByRole('textbox', { name: '제목' }).fill('주간 팀 회의');

  await page.getByRole('textbox', { name: '날짜' }).fill('2025-01-01');
  await page.getByRole('textbox', { name: '시작 시간' }).click();
  await page.getByRole('textbox', { name: '시작 시간' }).fill('10:00');
  await page.getByRole('textbox', { name: '종료 시간' }).click();
  await page.getByRole('textbox', { name: '종료 시간' }).fill('11:00');

  await page.getByRole('textbox', { name: '설명' }).click();
  await page.getByRole('textbox', { name: '설명' }).fill('주간 업무 보고 및 계획 수립');

  await page.getByRole('textbox', { name: '위치' }).click();
  await page.getByRole('textbox', { name: '위치' }).fill('회의실 A');

  await page.getByText('카테고리카테고리 선택업무개인가족기타').click();
  await page.getByLabel('카테고리').selectOption('업무');

  await page.locator('span').first().click();
  await page.getByLabel('반복 유형').selectOption('weekly');
  await page.getByRole('textbox', { name: '반복 종료일' }).fill('2025-06-30');

  await page.getByTestId('event-submit-button').click();

  await page.getByText('일정이 추가되었습니다.');
});
