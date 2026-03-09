import type { AppProps } from 'next/app';
import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import '../scss/app.scss';
import { LanguageProvider } from '../libs/i18n/LanguageContext';
import { ThemeModeProvider } from '../libs/theme/ThemeModeContext';

const App = ({ Component, pageProps }: AppProps) => {
	const client = useApollo(pageProps.initialApolloState);

	return (
		<ApolloProvider client={client}>
			<LanguageProvider>
				<ThemeModeProvider>
					<Component {...pageProps} />
				</ThemeModeProvider>
			</LanguageProvider>
		</ApolloProvider>
	);
};

export default App;
