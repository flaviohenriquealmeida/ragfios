export interface TTSRequest {
	text: string;
	conversationId: string;
	voice?: string;
}

export interface TTSService {
	dispatch(request: TTSRequest): Promise<void>;
}

