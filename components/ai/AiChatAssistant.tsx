import React from 'react';
import { Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useThemeMode } from '../../libs/theme/ThemeModeContext';
import { useLanguage } from '../../libs/i18n/LanguageContext';
import { AI_CHAT } from '../../apollo/user/mutation';
import { getJwtToken } from '../../libs/auth';
import { sweetInfoAlert } from '../../libs/sweetAlert';

type ChatRole = 'user' | 'ai';

type ChatMessage = {
	id: string;
	role: ChatRole;
	content: string;
};

const AiChatAssistant = () => {
	const { isDark } = useThemeMode();
	const { t, locale } = useLanguage();
	const router = useRouter();
	const [message, setMessage] = React.useState('');
	const [sending, setSending] = React.useState(false);
	const [aiChatMutation] = useMutation(AI_CHAT);
	const [messages, setMessages] = React.useState<ChatMessage[]>([
		{
			id: 'seed-1',
			role: 'ai',
			content: t('ai.chatSubtitle'),
		},
	]);

	const listRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		if (!listRef.current) return;
		listRef.current.scrollTop = listRef.current.scrollHeight;
	}, [messages]);

	const handleSend = async () => {
		const jwt = getJwtToken();
		if (!jwt) {
			await sweetInfoAlert(t('ai.loginRequired'));
			return;
		}

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

		try {
			const { data } = await aiChatMutation({
				variables: { message: cleaned, locale },
			});
			const payload = data?.aiChat;
			const answer = String(payload?.reply || t('ai.chatFallback'));
			setMessages((prev) => [
				...prev,
				{
					id: `ai-${Date.now()}`,
					role: 'ai',
					content: answer,
				},
			]);

			if (payload?.actionType === 'OPEN_PAGE' && payload?.actionTarget) {
				void router.push(payload.actionTarget);
			}
		} catch (err) {
			setMessages((prev) => [
				...prev,
				{
					id: `ai-${Date.now()}`,
					role: 'ai',
					content: t('ai.chatError'),
				},
			]);
		}
		setSending(false);
	};

	return (
		<Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
			<Typography sx={{ color: isDark ? '#E5E7EB' : '#111111', fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 700, mb: 1 }}>
				{t('ai.chatTitle')}
			</Typography>
			<Typography sx={{ color: isDark ? '#AEB6C2' : '#666666', mb: 3 }}>
				{t('ai.chatSubtitle')}
			</Typography>
			<Box
				sx={{
					height: { xs: 180, md: 210 },
					borderRadius: '18px',
					overflow: 'hidden',
					mb: 2.2,
					border: isDark ? '1px solid rgba(212,175,55,0.28)' : '1px solid rgba(17,17,17,0.1)',
					backgroundImage:
						'linear-gradient(120deg, rgba(16,23,34,0.8), rgba(16,23,34,0.34)), url(https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=1400&q=80)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					display: 'flex',
					alignItems: 'flex-end',
					p: 2,
				}}
			>
				<Typography sx={{ color: '#FAFAFA', fontWeight: 700, fontSize: { xs: '1rem', md: '1.15rem' } }}>
					{t('ai.chatVisualCaption')}
				</Typography>
			</Box>

			<Box
				sx={{
					borderRadius: '18px',
					border: isDark ? '1px solid rgba(212,175,55,0.34)' : '1px solid rgba(17,17,17,0.12)',
					background: isDark ? '#101722' : '#FFFFFF',
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
									background: item.role === 'user' ? '#111111' : isDark ? '#182232' : '#F5F5F5',
									border: item.role === 'user' ? '1px solid #111111' : isDark ? '1px solid rgba(212,175,55,0.25)' : '1px solid rgba(17,17,17,0.08)',
								}}
							>
								<Typography sx={{ color: item.role === 'user' ? '#FAFAFA' : isDark ? '#E5E7EB' : '#111111', fontSize: '0.9rem', lineHeight: 1.58 }}>
									{item.content}
								</Typography>
							</Box>
						</Stack>
					))}
				</Stack>

				<Stack direction="row" spacing={1} sx={{ mt: 1.2 }}>
					<TextField
						fullWidth
						placeholder={t('ai.chatPlaceholder')}
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
						{sending ? t('ai.sending') : t('ai.send')}
					</Button>
				</Stack>
			</Box>
		</Container>
	);
};

export default AiChatAssistant;
