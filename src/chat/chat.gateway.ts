import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private connectedUsers = new Map<string, string>();

  constructor(
    @InjectModel(Message.name) private readonly messageModel: Message,
    private readonly chatService: ChatService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.connectedUsers.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) this.connectedUsers.delete(userId);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('register')
  registerUser(client: Socket, userId: string) {
    this.connectedUsers.set(userId, client.id);
    console.log(`User registered: ${userId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(client: Socket, @MessageBody() payload: SendMessageDto) {
    const { sender, recipient, content } = payload;

    if (!sender || !recipient || content) {
      return await this.server.emit(
        `${recipient}`,
        'sender, recipient, content are required',
      );
    }

    let chat;
    chat = await this.chatService.findChat(sender, recipient);
    if (!chat) {
      //create chat
      chat = await this.chatService.createChat(sender, recipient);
    }

    let chatId = chat._id;

    const message = await this.chatService.sendMessage({
      sender,
      recipient,
      content,
      chatId,
    });

    if (recipient) return await this.server.emit(`${recipient}`, message);
  }
}
