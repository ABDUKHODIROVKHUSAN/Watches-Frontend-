import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
				<meta name="keyword" content="watches, luxury watches, rolex, omega, cartier" />
				<meta name="description" content="Discover premium luxury watches. Browse, buy, and explore the finest timepieces from world-renowned brands." />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
