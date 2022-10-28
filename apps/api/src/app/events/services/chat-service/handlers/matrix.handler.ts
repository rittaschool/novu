import { ICredentials } from '@novu/dal';
import { MatrixChatProvider } from '@novu/matrix';
import { ChannelTypeEnum } from '@novu/stateless';
import { BaseChatHandler } from './base.handler';

export class MatrixHandler extends BaseChatHandler {
  constructor() {
    super('Matrix', ChannelTypeEnum.CHAT);
  }

  buildProvider(credentials: ICredentials) {
    this.provider = new MatrixChatProvider({
      homeServer: credentials.host,
      accessToken: credentials.apiKey,
      userId: credentials.user,
    });
  }
}
