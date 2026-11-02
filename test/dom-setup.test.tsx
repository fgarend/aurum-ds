import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { type ReactElement, useState } from "react";
import { expect, it } from "vitest";

// A fictitious component that exists only here. It proves that jsdom, Testing Library, user-event
// and jest-dom work together (decision 0020), so an update that breaks one of them fails here first.
function Counter(): ReactElement {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}

it("renders, focuses and clicks a component", async () => {
  const user = userEvent.setup();
  render(<Counter />);
  const button = screen.getByRole("button", { name: "Clicked 0 times" });

  await user.tab();
  expect(button).toHaveFocus();

  await user.click(button);
  expect(button).toHaveAccessibleName("Clicked 1 times");
});
