
export type ActionCode = 'draft'
  | 'tm_submitted' | 'tm_approve' | 'tm_reject' | 'tm_revise'
  | 'cost_submitted' | 'cost_reject' | 'cost_revise'
  | 'cost_reviewed' | 'cost_owner' | 'cost_approve'

export interface ActionInfo {
  code: ActionCode,
  id: number,
  name: string,
}
