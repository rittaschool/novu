import {
  ChannelTypeEnum,
  IChatOptions,
  IChatProvider,
  ISendMessageSuccessResponse,
} from '@novu/stateless';
import { MatrixClient } from 'matrix-js-sdk';
import { IMatrixConfig } from './matrix.config';

export class MatrixChatProvider implements IChatProvider {
  channelType = ChannelTypeEnum.CHAT as ChannelTypeEnum.CHAT;
  matrix: MatrixClient;
  id: string;

  constructor(private readonly config: IMatrixConfig) {
    this.matrix = new MatrixClient({
      baseUrl: `https://${this.config.homeServer}`,
      accessToken: this.config.accessToken,
      userId: this.config.userId,
    });
  }

  async sendMessage(
    options: IChatOptions
  ): Promise<ISendMessageSuccessResponse> {
    await this.matrix.startClient();

    return {
      id: 'PLACEHOLDER',
      date: 'PLACEHOLDER',
    };
  }

  asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));

    return arr.filter((_v, index) => results[index]);
  };

  async getDirectRoomId(userId: string) {
    const rooms = await this.matrix.getJoinedRooms();
    const invitedDMRooms = await this.asyncFilter(
      rooms,
      async (room: string) => {
        const members = Object.keys(
          (await this.matrix.getJoinedRoomMembers(room)).joined
        );
        if (members.length > 2) return false;

        const matrixRoom = this.matrix.getRoom(room);

        const roomMembers = matrixRoom.getMembers();

        return (
          roomMembers[1].type === 'm.room.member' &&
          roomMembers[1].membership === 'join' &&
          roomMembers[1].sender === (await ElementClient.getUserId()) &&
          roomMembers[0].type === 'm.room.member' &&
          roomMembers[0].membership === 'join' &&
          roomMembers[0].sender === user_id &&
          roomMembers[0].previousContent.is_direct
        );
      }
    );

    return invitedDMRooms.length > 0
      ? invitedDMRooms[0]
      : await this.matrix.createRoom({
          preset: 'trusted_private_chat',
          invite: [user_id],
          is_direct: true,
        });
  }
}
