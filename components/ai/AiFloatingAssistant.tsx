import React from 'react';
import { useMutation } from '@apollo/client';
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useRouter } from 'next/router';
import { AI_CHAT } from '../../apollo/user/mutation';
import { getJwtToken } from '../../libs/auth';
import { useLanguage } from '../../libs/i18n/LanguageContext';
import { sweetInfoAlert } from '../../libs/sweetAlert';

type ChatRole = 'user' | 'ai';
type ChatMessage = { id: string; role: ChatRole; content: string };

const AiFloatingAssistant = () => {
	const { t, locale } = useLanguage();
	const router = useRouter();
	const [aiChatMutation] = useMutation(AI_CHAT);
	const [visible, setVisible] = React.useState(false);
	const [open, setOpen] = React.useState(false);
	const [sending, setSending] = React.useState(false);
	const [message, setMessage] = React.useState('');
	const [messages, setMessages] = React.useState<ChatMessage[]>([
		{
			id: 'float-seed',
			role: 'ai',
			content: t('ai.chatSubtitle'),
		},
	]);
	const listRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		const handleScroll = () => setVisible(window.scrollY > 320);
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	React.useEffect(() => {
		if (!listRef.current) return;
		listRef.current.scrollTop = listRef.current.scrollHeight;
	}, [messages, open]);

	const handleSend = async () => {
		const jwt = getJwtToken();
		if (!jwt) {
			await sweetInfoAlert(t('ai.loginRequired'));
			return;
		}

		const cleaned = message.trim();
		if (!cleaned || sending) return;

		setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', content: cleaned }]);
		setMessage('');
		setSending(true);

		try {
			const { data } = await aiChatMutation({
				variables: { message: cleaned, locale },
			});
			const payload = data?.aiChat;
			const reply = String(payload?.reply || t('ai.chatFallback'));
			setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'ai', content: reply }]);

			if (payload?.actionType === 'OPEN_PAGE' && payload?.actionTarget) {
				setOpen(false);
				void router.push(payload.actionTarget);
			}
		} catch (err) {
			setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: 'ai', content: t('ai.chatError') }]);
		}

		setSending(false);
	};

	const handleToggleChat = async () => {
		if (open) {
			setOpen(false);
			return;
		}

		const jwt = getJwtToken();
		if (!jwt) {
			await sweetInfoAlert(t('ai.loginRequired'));
			return;
		}

		setOpen(true);
	};

	if (!visible) return null;

	return (
		<Box sx={{ position: 'fixed', right: { xs: 14, md: 22 }, bottom: { xs: 14, md: 22 }, zIndex: 1300 }}>
			{open ? (
				<Box
					sx={{
						width: { xs: 'min(92vw, 360px)', md: 380 },
						height: 470,
						borderRadius: '18px',
						border: '1px solid rgba(212,175,55,0.46)',
						background: '#FAFAFA',
						boxShadow: '0 20px 44px rgba(17,17,17,0.2)',
						overflow: 'hidden',
						mb: 1,
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, py: 1.1, borderBottom: '1px solid rgba(17,17,17,0.08)' }}>
						<Stack direction="row" spacing={0.8} alignItems="center">
							<AutoAwesomeIcon sx={{ fontSize: 20, color: '#6A42F4' }} />
							<Typography sx={{ fontWeight: 700, color: '#111111' }}>{t('ai.askButton')}</Typography>
						</Stack>
						<IconButton size="small" onClick={() => setOpen(false)}>
							<CloseIcon fontSize="small" />
						</IconButton>
					</Stack>

					<Stack ref={listRef} spacing={1} sx={{ flex: 1, px: 1.2, py: 1.1, overflowY: 'auto', background: '#FFFFFF' }}>
						{messages.map((item) => (
							<Stack key={item.id} alignItems={item.role === 'user' ? 'flex-end' : 'flex-start'}>
								<Box
									sx={{
										maxWidth: '86%',
										px: 1.2,
										py: 0.9,
										borderRadius: item.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
										background: item.role === 'user' ? '#111111' : '#F2F4F7',
										color: item.role === 'user' ? '#FAFAFA' : '#111111',
									}}
								>
									<Typography sx={{ fontSize: '0.86rem', lineHeight: 1.55 }}>{item.content}</Typography>
								</Box>
							</Stack>
						))}
					</Stack>

					<Stack direction="row" spacing={1} sx={{ p: 1.1, borderTop: '1px solid rgba(17,17,17,0.08)', background: '#FAFAFA' }}>
						<TextField
							fullWidth
							size="small"
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
						<IconButton
							onClick={() => void handleSend()}
							disabled={sending}
							sx={{ background: '#ECECF1', borderRadius: '10px', '&:hover': { background: '#E5E7EB' } }}
						>
							<ArrowUpwardIcon sx={{ fontSize: 18 }} />
						</IconButton>
					</Stack>
				</Box>
			) : null}

			<Box
				onClick={() => void handleToggleChat()}
				sx={{
					cursor: 'pointer',
					borderRadius: '999px',
					px: 2.2,
					py: 1.05,
					background: 'linear-gradient(135deg, #6A42F4 0%, #8E6BFF 100%)',
					color: '#FFFFFF',
					boxShadow: '0 10px 30px rgba(94, 63, 244, 0.36)',
				}}
			>
				<Stack direction="row" spacing={0.7} alignItems="center">
					<AutoAwesomeIcon sx={{ fontSize: 18 }} />
					<Typography sx={{ fontWeight: 700, fontSize: '0.98rem' }}>{t('ai.askButton')}</Typography>
				</Stack>
			</Box>
		</Box>
	);
};

export default AiFloatingAssistant;
