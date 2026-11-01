import type * as React from 'react';

export type IconName = 'home' | 'wallet' | 'bar-chart' | 'pie-chart' | 'trending-up' | 'trending-down' | 'arrow-up-right' | 'arrow-down-left' | 'arrows-swap' | 'plus' | 'minus' | 'search' | 'bell' | 'sliders' | 'calendar' | 'check' | 'x' | 'chevron-right' | 'chevron-left' | 'chevron-down' | 'more' | 'credit-card' | 'shopping-bag' | 'utensils' | 'bus' | 'briefcase' | 'building' | 'heart-pulse' | 'target' | 'piggy' | 'alert-circle' | 'info' | 'eye' | 'eye-off' | 'filter' | 'download' | 'repeat' | 'tag' | 'user' | 'settings' | 'log-out';
export type MoneyTone = 'auto' | 'neutral' | 'income' | 'expense' | 'invest' | 'muted';
export interface MoneyFormat { currency?: string; locale?: string; decimals?: number }

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { href?: string; variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'; icon?: IconName; iconRight?: IconName; block?: boolean; loading?: boolean }
export declare function Button(props: ButtonProps): React.ReactElement;
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { href?: string; icon: IconName; label: string; variant?: 'ghost' | 'secondary' | 'primary' | 'accent'; size?: 'sm' | 'md' | 'lg'; dot?: boolean }
export declare function IconButton(props: IconButtonProps): React.ReactElement;
export interface IconProps { name: IconName; size?: number; strokeWidth?: number; label?: string; className?: string; style?: React.CSSProperties }
export declare function Icon(props: IconProps): React.ReactElement;

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> { label?: string; hint?: string; error?: string; icon?: IconName; prefix?: React.ReactNode; suffix?: React.ReactNode; trailing?: React.ReactNode; pill?: boolean }
export declare function TextField(props: TextFieldProps): React.ReactElement;
export interface AmountInputProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: string; hint?: string; error?: string; kind?: 'neutral' | 'income' | 'expense'; currencySymbol?: string }
export declare function AmountInput(props: AmountInputProps): React.ReactElement;
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { label?: string; hint?: string; error?: string; placeholder?: string; options: Array<string | { value: string; label: string; disabled?: boolean }> }
export declare function Select(props: SelectProps): React.ReactElement;
export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode; indeterminate?: boolean }
export declare function Checkbox(props: CheckboxProps): React.ReactElement;
export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> { label?: React.ReactNode }
export declare function Switch(props: SwitchProps): React.ReactElement;
export interface SegmentedControlProps { options: Array<{ value: string; label: React.ReactNode; icon?: IconName }>; value?: string; defaultValue?: string; onChange?: (value: string) => void; label?: string; block?: boolean; className?: string }
export declare function SegmentedControl(props: SegmentedControlProps): React.ReactElement;

export interface CardProps { title?: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode; variant?: 'raised' | 'flat' | 'sunken'; flush?: boolean; children?: React.ReactNode; className?: string; style?: React.CSSProperties }
export declare function Card(props: CardProps): React.ReactElement;
export interface SectionProps { title?: React.ReactNode; subtitle?: React.ReactNode; eyebrow?: React.ReactNode; actions?: React.ReactNode; footer?: React.ReactNode; divided?: boolean; children?: React.ReactNode; className?: string; style?: React.CSSProperties }
export declare function Section(props: SectionProps): React.ReactElement;
export interface BadgeProps { tone?: 'neutral' | 'primary' | 'income' | 'expense' | 'invest' | 'warning' | 'outline'; dot?: boolean; icon?: IconName; children?: React.ReactNode }
export declare function Badge(props: BadgeProps): React.ReactElement;
export type PersonTone = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export interface AvatarProps { name: string; src?: string; size?: 'xs' | 'sm' | 'md' | 'lg'; tone?: PersonTone }
export declare function Avatar(props: AvatarProps): React.ReactElement;

export interface AlertProps { tone?: 'info' | 'success' | 'warning' | 'danger'; title?: React.ReactNode; children?: React.ReactNode; icon?: IconName; onClose?: () => void; closeLabel?: string }
export declare function Alert(props: AlertProps): React.ReactElement;
export interface ProgressBarProps { value: number; max?: number; label?: string; showValue?: boolean; valueText?: string; tone?: 'primary' | 'income' | 'expense' | 'warning' | 'invest'; size?: 'sm' | 'md' }
export declare function ProgressBar(props: ProgressBarProps): React.ReactElement;
export interface EmptyStateProps { icon?: IconName; title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode }
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;
export interface DialogProps { open: boolean; onClose?: () => void; title: React.ReactNode; description?: React.ReactNode; children?: React.ReactNode; actions?: React.ReactNode; inline?: boolean; closeLabel?: string }
export declare function Dialog(props: DialogProps): React.ReactElement | null;

export type NavItem = { id: string; label: string; icon?: IconName; count?: number; countTone?: 'neutral' | 'attention'; href?: string } | { section: string; collapsible?: boolean; defaultOpen?: boolean };
export interface ScopeOption { id: string; label: string; title?: string; href?: string; initials?: string; tone?: PersonTone; people?: Array<{ initials: string; tone?: PersonTone }> }
export interface SidebarProps { size?: 'md' | 'lg'; collapsible?: boolean; collapsed?: boolean; defaultCollapsed?: boolean; onCollapsedChange?: (collapsed: boolean) => void; collapseLabel?: string; expandLabel?: string; scopePlacement?: 'bottom' | 'top'; scopes?: ScopeOption[]; scope?: string; defaultScope?: string; onScopeChange?: (id: string) => void; scopeLabel?: string; variant?: 'surface' | 'canvas' | 'inverse'; brandMark?: React.ReactNode; brand?: React.ReactNode; items: NavItem[]; active?: string; defaultActive?: string; onSelect?: (id: string) => void; footer?: React.ReactNode; label?: string }
export declare function Sidebar(props: SidebarProps): React.ReactElement;
export interface BottomNavProps { items: Array<{ id: string; label: string; icon: IconName; primary?: boolean; href?: string }>; active?: string; defaultActive?: string; onSelect?: (id: string) => void; label?: string }
export declare function BottomNav(props: BottomNavProps): React.ReactElement;

export interface AmountProps extends MoneyFormat { value: number; size?: 'sm' | 'md' | 'lg' | 'kpi' | 'xl'; tone?: MoneyTone; sign?: 'auto' | 'always' | 'never'; hidden?: boolean; hiddenLabel?: string; className?: string }
export declare function Amount(props: AmountProps): React.ReactElement;
export type StatLayout = 'default' | 'side';
export type StatIconVariant = 'soft' | 'solid' | 'outline';
export type StatIconShape = 'square' | 'circle';
export interface StatBreakdownItem { label: string; value: number; initials?: string; tone?: PersonTone }
export interface StatCardProps extends MoneyFormat { breakdown?: StatBreakdownItem[]; layout?: StatLayout; iconVariant?: StatIconVariant; iconShape?: StatIconShape; highlight?: boolean; label: React.ReactNode; value: number; icon?: IconName; tone?: 'primary' | 'income' | 'expense' | 'invest'; delta?: number; deltaLabel?: React.ReactNode; invertDelta?: boolean; footer?: React.ReactNode; sparkline?: number[]; hidden?: boolean; plain?: boolean }
export declare function StatCard(props: StatCardProps): React.ReactElement;
export interface StatStripItem { breakdown?: StatBreakdownItem[]; label: React.ReactNode; value: number; icon?: IconName; highlight?: boolean; delta?: number; deltaLabel?: React.ReactNode; invertDelta?: boolean }
export interface StatStripProps extends MoneyFormat { items: StatStripItem[]; layout?: StatLayout; iconVariant?: StatIconVariant; iconShape?: StatIconShape; hidden?: boolean; className?: string; style?: React.CSSProperties }
export declare function StatStrip(props: StatStripProps): React.ReactElement;
export interface DeltaProps { value: number; invert?: boolean; label?: React.ReactNode; locale?: string }
export declare function Delta(props: DeltaProps): React.ReactElement | null;
export interface TransactionRowProps extends MoneyFormat { owner?: string; ownerTone?: PersonTone; ownerLabel?: string; tag?: React.ReactNode; title: React.ReactNode; meta?: React.ReactNode; amount: number; kind?: 'income' | 'expense' | 'transfer' | 'investment'; category?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; categoryColor?: string; categorySoft?: string; icon?: IconName; date?: React.ReactNode; pending?: boolean; pendingLabel?: string; recurring?: boolean; neutralTile?: boolean; onClick?: () => void; hidden?: boolean }
export declare function TransactionRow(props: TransactionRowProps): React.ReactElement;
export interface BudgetBarProps extends MoneyFormat { label: React.ReactNode; icon?: IconName; spent: number; limit: number; warnAt?: number; ofLabel?: string; leftLabel?: string; overLabel?: string }
export declare function BudgetBar(props: BudgetBarProps): React.ReactElement;
export interface AllocationBarProps extends MoneyFormat { items: Array<{ label: string; value: number; color?: string }>; showAmounts?: boolean; legend?: boolean }
export declare function AllocationBar(props: AllocationBarProps): React.ReactElement;
export interface SparklineProps { data: number[]; width?: number; height?: number; tone?: 'income' | 'expense' | 'invest'; area?: boolean; label?: string }
export declare function Sparkline(props: SparklineProps): React.ReactElement | null;

export declare function formatMoney(value: number, options?: MoneyFormat & { signed?: boolean }): string;
export declare function formatPercent(value: number, options?: { locale?: string; decimals?: number }): string;

declare global { interface Window { Aurum: { Button: typeof Button; IconButton: typeof IconButton; Icon: typeof Icon; TextField: typeof TextField; AmountInput: typeof AmountInput; Select: typeof Select; Checkbox: typeof Checkbox; Switch: typeof Switch; SegmentedControl: typeof SegmentedControl; Card: typeof Card; Section: typeof Section; Badge: typeof Badge; Avatar: typeof Avatar; Alert: typeof Alert; ProgressBar: typeof ProgressBar; EmptyState: typeof EmptyState; Dialog: typeof Dialog; Sidebar: typeof Sidebar; BottomNav: typeof BottomNav; Amount: typeof Amount; StatCard: typeof StatCard; StatStrip: typeof StatStrip; Delta: typeof Delta; TransactionRow: typeof TransactionRow; BudgetBar: typeof BudgetBar; AllocationBar: typeof AllocationBar; Sparkline: typeof Sparkline; formatMoney: typeof formatMoney; formatPercent: typeof formatPercent } } }
