export type AccessMatch = 'any' | 'all';

export interface AccessRule<TMode extends string = string> {
  action: string;
  subject: string;
  mode?: TMode;
}

export interface AccessConfig<TMode extends string = string> {
  rules: AccessRule<TMode>[];
  match?: AccessMatch;
}

export type AccessResolver<
  TMode extends string = string,
  TRule extends AccessRule<TMode> = AccessRule<TMode>,
> = (rule: TRule, mode: TMode) => boolean;

export type ViewAccessMode = 'view';
export type ViewEditAccessMode = 'view' | 'edit';
export type ActionAccessMode = 'action';

export type ViewAccessRule = AccessRule<ViewAccessMode>;
export type ViewEditAccessRule = AccessRule<ViewEditAccessMode>;
export type ActionAccessRule = AccessRule<ActionAccessMode>;

export type ViewAccessConfig = AccessConfig<ViewAccessMode>;
export type ViewEditAccessConfig = AccessConfig<ViewEditAccessMode>;
export type ActionAccessConfig = AccessConfig<ActionAccessMode>;

export type ViewAccessResolver = AccessResolver<ViewAccessMode, ViewAccessRule>;
export type ViewEditAccessResolver = AccessResolver<
  ViewEditAccessMode,
  ViewEditAccessRule
>;
export type ActionAccessResolver = AccessResolver<
  ActionAccessMode,
  ActionAccessRule
>;
