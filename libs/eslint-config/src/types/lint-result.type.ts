export interface LintResult {
  filePath: string;
  messages: Message[];
  suppressedMessages: Message[];
  errorCount: number;
  fatalErrorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  usedDeprecatedRules: UsedDeprecatedRule[];
  source?: string;
}

export interface Message {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  messageId: string;
  endLine: number;
  endColumn: number;
}

export interface UsedDeprecatedRule {
  ruleId: string;
  replacedBy: string[];
}
