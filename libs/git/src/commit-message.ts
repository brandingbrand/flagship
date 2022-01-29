import { Header } from './commit';

export class CommitMessage implements Header {
  constructor(
    private readonly message: Partial<Header> & Pick<Header, 'subject' | 'scope' | 'type'>
  ) {}

  public readonly breaking = this.message.breaking ?? false;
  public readonly merge = this.message.merge ?? false;
  public readonly revert = this.message.revert ?? null;
  public readonly references = this.message.references ?? [];

  public readonly type = this.message.type;
  public readonly scope = this.message.scope;
  public readonly subject = this.message.subject;
}
