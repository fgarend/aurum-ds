import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowDownLeft, Info, PiggyBank, Plus, Wallet } from "lucide-react";
import { Icon } from "./Icon.js";

// The Icon's examples (decision 0057), for the gallery and the tests.
const meta = {
  title: "Components/Icon",
  component: Icon,
  args: { icon: Wallet },
} satisfies Meta<typeof Icon>;

type Story = StoryObj<typeof meta>;

const drawings = [Wallet, PiggyBank, ArrowDownLeft, Plus, Info];
const smallControl = 16;
const input = 18;
const bottomNavigation = 22;

// Beside a text, hidden from screen readers.
const Default: Story = {};

// Alone, carrying its meaning.
const Labelled: Story = { args: { icon: Info, label: "Information" } };

// Every size the design uses, for a few drawings.
const Sizes: Story = {
  render: () => (
    <div data-testid="icons">
      {[smallControl, input, undefined, bottomNavigation].map((size) => (
        <div
          key={size ?? "default"}
          style={{
            display: "flex",
            gap: "var(--au-space-3)",
            padding: "var(--au-space-2)",
          }}
        >
          {drawings.map((drawing) => (
            <Icon
              icon={drawing}
              key={drawing.displayName}
              {...(size === undefined ? {} : { size })}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export default meta;
export { Default, Labelled, Sizes };
