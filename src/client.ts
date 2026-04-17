// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import readline from 'readline';
import { v7 as uuid } from 'uuid';

const API_URL = 'http://localhost:3000/api/prompt';
const conversationId = uuid(); // change to an existing UUID to continue conversation

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

async function streamPrompt(prompt: string): Promise<void> {
	try {
		const res = await fetch(API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ prompt, conversationId })
		});

		if (!res.ok) {
			console.error('HTTP Error:', res.status);
			return;
		}

		if (!res.body) {
			console.error('No response body (stream missing)');
			return;
		}

		const reader = res.body.getReader();
		const decoder = new TextDecoder();

		let buffer = '';

		process.stdout.write('LLM: ');

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			let boundary;
			while ((boundary = buffer.indexOf('\n')) !== -1) {
				const line = buffer.slice(0, boundary).trim();
				buffer = buffer.slice(boundary + 1);

				if (!line) continue;

				try {
					const msg = JSON.parse(line);

					if (msg.type === 'text') {
						process.stdout.write(msg.delta);
					} else if (msg.type === 'done') {
						// optional: print stats
						process.stdout.write('\n');
						process.stdout.write(msg.stats);
					}
				} catch (err) {
					console.error('Parse error:', err);
				}
			}
		}

		process.stdout.write('\n\n');
	} catch (err: unknown) {
		console.error('Error:', (err as { message: string }).message);
	}
}

function chat(): void {
	rl.question('You: ', async (input) => {
		if (input.toLowerCase() === 'exit') {
			console.log('Bye!');
			rl.close();
			return;
		}

		await streamPrompt(input);
		chat();
	});
}

console.log('Streaming Chat Client');
console.log("Type 'exit' to quit\n");

chat();

