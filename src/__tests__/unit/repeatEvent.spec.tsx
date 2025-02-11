import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../../App';

describe('반복 유형 선택', () => {
  it('일정 생성 시 반복 유형을 선택할 수 있다.', () => {
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

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
    render(
      <ChakraProvider>
        <App />
      </ChakraProvider>
    );

    const editButton = await screen.findByLabelText('Edit event');
    await userEvent.click(editButton);

    const repeatSetting = await screen.findByLabelText('반복 설정');
    await userEvent.click(repeatSetting);

    const repeatSelect = screen.getByLabelText('반복 유형');

    expect(repeatSelect).toBeInTheDocument();

    const options = [...repeatSelect.children];
    expect(options.length).toBe(4);

    const optionsValue = options.map((option) => option.textContent);
    expect(optionsValue).toContain('매일');
    expect(optionsValue).toContain('매주');
    expect(optionsValue).toContain('매월');
  });
});
