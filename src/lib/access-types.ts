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
