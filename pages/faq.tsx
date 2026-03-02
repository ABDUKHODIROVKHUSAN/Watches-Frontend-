import React, { useState } from 'react';
import Head from 'next/head';
import { Stack, Container, Typography, Box, Button } from '@mui/material';
import Top from '../libs/components/Top';
import Footer from '../libs/components/Footer';

type FaqItem = {
	id: string;
	question: string;
	answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
	{
		id: 'shipping',
		question: 'How long does shipping take?',
		answer:
			'Most orders are prepared within 1-2 business days. Standard delivery usually takes 3-7 business days depending on your location.',
	},
	{
		id: 'authenticity',
		question: 'Are all watches authentic?',
		answer:
			'Yes. Every timepiece listed on Timeless Watches is authenticity-checked and quality-inspected before it is offered for sale.',
	},
	{
		id: 'payment',
		question: 'What payment methods do you accept?',
		answer:
			'We currently support card-based checkout (VISA, MASTERCARD, and DOMESTIC cards configured in your account payment details).',
	},
	{
		id: 'returns',
		question: 'Can I return a watch after purchase?',
		answer:
			'Returns are accepted according to our return policy window if the watch remains in original condition. Contact support for return approval.',
	},
	{
		id: 'warranty',
		question: 'Do watches come with warranty?',
		answer:
			'Warranty terms vary by model and seller. Warranty information is provided in the watch details or during purchase confirmation.',
	},
	{
		id: 'aihelp',
		question: 'What does the AI Help feature provide?',
		answer:
			'AI Help gives style guidance, market context, popularity insights, and celebrity wearing references to help you make a confident choice.',
	},
];

const FaqPage = () => {
	const [openAnswers, setOpenAnswers] = useState<Record<string, boolean>>({});

	const toggleAnswer = (id: string) => {
		setOpenAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<>
			<Head>
				<title>FAQ - Timeless Watches</title>
			</Head>
			<Stack sx={{ background: '#FAFAFA', minHeight: '100vh', display: 'flex' }}>
				<Top />
				<Stack
					sx={{
						pt: { xs: 13, md: 15 },
						pb: { xs: 6, md: 8 },
						background:
							'linear-gradient(180deg, rgba(17,17,17,0.98) 0%, rgba(17,17,17,0.94) 100%)',
						position: 'relative',
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							backgroundImage: 'url(https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1800&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
							opacity: 0.14,
						}}
					/>
					<Container maxWidth="md" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
						<Typography
							sx={{
								color: 'rgba(212,175,55,0.95)',
								fontSize: '0.74rem',
								fontWeight: 700,
								letterSpacing: '2.2px',
								textTransform: 'uppercase',
								mb: 1.1,
							}}
						>
							Timeless Watches
						</Typography>
						<Typography sx={{ color: '#FAFAFA', fontSize: { xs: '2rem', md: '2.7rem' }, fontWeight: 700, mb: 1.2 }}>
							Frequently Asked Questions
						</Typography>
						<Typography sx={{ color: 'rgba(250,250,250,0.78)', fontSize: '0.92rem', maxWidth: 680, mx: 'auto' }}>
							Quick answers to common questions about orders, authenticity, payment, and support.
						</Typography>
					</Container>
				</Stack>

				<Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
					<Stack spacing={1.6}>
						{FAQ_ITEMS.map((item) => {
							const isOpen = Boolean(openAnswers[item.id]);
							return (
								<Box
									key={item.id}
									sx={{
										background: '#FFFFFF',
										border: '1px solid rgba(17,17,17,0.12)',
										borderRadius: '14px',
										p: { xs: 2, md: 2.2 },
										boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
									}}
								>
									<Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.2}>
										<Typography sx={{ color: '#111111', fontWeight: 600, fontSize: '0.98rem', pr: 1 }}>
											{item.question}
										</Typography>
										<Button
											variant={isOpen ? 'outlined' : 'contained'}
											onClick={() => toggleAnswer(item.id)}
											sx={{
												alignSelf: { xs: 'flex-start', sm: 'center' },
												textTransform: 'none',
												fontWeight: 700,
												fontSize: '0.78rem',
												borderColor: 'rgba(0,0,0,0.24)',
												color: isOpen ? '#111111' : '#D4AF37',
												background: isOpen ? 'transparent' : '#4A4A4A',
												'&:hover': {
													borderColor: '#D4AF37',
													color: isOpen ? '#D4AF37' : '#D4AF37',
													background: isOpen ? 'rgba(212,175,55,0.07)' : '#5A5A5A',
												},
											}}
										>
											{isOpen ? 'Hide Answer' : 'See Answer'}
										</Button>
									</Stack>
									{isOpen && (
										<Box
											sx={{
												mt: 1.6,
												pt: 1.4,
												borderTop: '1px solid rgba(212,175,55,0.45)',
											}}
										>
											<Typography sx={{ color: '#666666', fontSize: '0.9rem', lineHeight: 1.7 }}>
												{item.answer}
											</Typography>
										</Box>
									)}
								</Box>
							);
						})}
					</Stack>
				</Container>
				<Box sx={{ mt: 'auto' }}>
					<Footer />
				</Box>
			</Stack>
		</>
	);
};

export default FaqPage;
