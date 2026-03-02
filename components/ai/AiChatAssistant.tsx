import React from 'react';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';

type ChatRole = 'user' | 'ai';

type ChatMessage = {
	id: string;
	role: ChatRole;
	content: string;
};

const AiChatAssistant = () => {
	const [message, setMessage] = React.useState('');
	const [sending, setSending] = React.useState(false);
	const [messages, setMessages] = React.useState<ChatMessage[]>([
		{
			id: 'seed-1',
			role: 'ai',
			content: 'Welcome to Timeless AI Assistant. Ask me about styles, value, movement types, or watch recommendations.',
		},
	]);

	const listRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		if (!listRef.current) return;
		listRef.current.scrollTop = listRef.current.scrollHeight;
	}, [messages]);

	const getMockResponse = (text: string): string => {
		if (text.toLowerCase().includes('rolex')) {
			return 'Rolex is excellent for long-term value and everyday prestige. If you want sport-luxury, consider Submariner or GMT-Master II.';
		}
		if (text.toLowerCase().includes('dress')) {
			return 'For dress-focused elegance, look at Cartier Tank, Jaeger-LeCoultre Reverso, or slim Patek Calatrava profiles.';
		}
		return 'Great question. Based on your interest, I suggest balancing case size, movement preference, and versatility before deciding.';
	};

	const handleSend = async () => {
		const cleaned = message.trim();
		if (!cleaned || sending) return;

		const newUserMessage: ChatMessage = {
			id: `user-${Date.now()}`,
			role: 'user',
			content: cleaned,
		};
		setMessages((prev) => [...prev, newUserMessage]);
		setMessage('');
		setSending(true);

		// TODO: connect to aiChat GraphQL mutation
		await new Promise((resolve) => setTimeout(resolve, 800));
		const aiReply: ChatMessage = {
			id: `ai-${Date.now()}`,
			role: 'ai',
			content: getMockResponse(cleaned),
		};
		setMessages((prev) => [...prev, aiReply]);
		setSending(false);
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
			<Typography sx={{ color: '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
				AI Chat Assistant
			</Typography>
			<Typography sx={{ color: '#666666', mb: 3 }}>
				Talk to your personal watch concierge for quick recommendations and buying guidance.
			</Typography>

			<Box
				sx={{
					borderRadius: '18px',
					border: '1px solid rgba(17,17,17,0.12)',
					background: '#FFFFFF',
					boxShadow: '0 10px 24px rgba(17,17,17,0.05)',
					p: { xs: 1.2, md: 1.6 },
				}}
			>
				<Stack
					ref={listRef}
					spacing={1.2}
					sx={{
						height: 340,
						overflowY: 'auto',
						pr: 0.5,
						py: 0.5,
					}}
				>
					{messages.map((item) => (
						<Stack
							key={item.id}
							direction="row"
							justifyContent={item.role === 'user' ? 'flex-end' : 'flex-start'}
						>
							<Box
								sx={{
									maxWidth: { xs: '88%', md: '72%' },
									px: 1.5,
									py: 1.1,
									borderRadius: item.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
									background: item.role === 'user' ? '#111111' : '#F5F5F5',
									border: item.role === 'user' ? '1px solid #111111' : '1px solid rgba(17,17,17,0.08)',
								}}
							>
								<Typography sx={{ color: item.role === 'user' ? '#FAFAFA' : '#111111', fontSize: '0.9rem', lineHeight: 1.58 }}>
									{item.content}
								</Typography>
							</Box>
						</Stack>
					))}
				</Stack>

				<Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
					<TextField
						fullWidth
						placeholder="Ask about models, movement, value, styling..."
						value={message}
						onChange={(event) => setMessage(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter' && !event.shiftKey) {
								event.preventDefault();
								void handleSend();
							}
						}}
					/>
					<Button
						variant="contained"
						disabled={sending}
						onClick={() => void handleSend()}
						sx={{
							background: '#111111',
							color: '#C6A969',
							fontWeight: 700,
							borderRadius: '12px',
							textTransform: 'none',
							px: 2.1,
							'&:hover': { background: '#232323' },
						}}
					>
						{sending ? 'Sending...' : 'Send'}
					</Button>
				</Stack>
			</Box>
		</Container>
	);
};

export default AiChatAssistant;
