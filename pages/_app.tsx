import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import '../scss/app.scss';

const theme = createTheme({
	palette: {
		primary: { main: '#1B1B1B' },
		secondary: { main: '#595f39' },
		background: { default: '#E4E4DE', paper: '#FFFFFF' },
		text: { primary: '#1B1B1B', secondary: '#6b6b6b' },
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
