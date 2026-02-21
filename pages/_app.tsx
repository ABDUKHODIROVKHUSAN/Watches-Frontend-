import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import '../scss/app.scss';

const theme = createTheme({
	palette: {
		primary: { main: '#1a1a2e' },
		secondary: { main: '#c9a96e' },
		background: { default: '#0f0f1a', paper: '#1a1a2e' },
		text: { primary: '#ffffff', secondary: '#b0b0b0' },
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
	},
});

const App = ({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default App;
