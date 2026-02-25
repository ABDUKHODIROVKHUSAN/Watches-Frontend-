import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import '../scss/app.scss';

const theme = createTheme({
	palette: {
		primary: { main: '#111111' },
		secondary: { main: '#D4AF37' },
		background: { default: '#FAFAFA', paper: '#FFFFFF' },
		text: { primary: '#111111', secondary: '#555555' },
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
