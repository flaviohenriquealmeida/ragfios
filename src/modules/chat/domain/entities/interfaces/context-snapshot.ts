import { ConversationMessage } from '../message';

export interface ContextSnapShot {
	summary: string;
	recentMessages: ConversationMessage[];
}
