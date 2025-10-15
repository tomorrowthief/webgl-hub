import React from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Link as ReactRouterLink } from 'react-router-dom';

interface HeaderProps {
    isNextJs: boolean;
    locale: string;
    locales: string[];
    content: any;
}

// This component uses Next.js hooks and components
const NextJsHeaderContent: React.FC<Omit<HeaderProps, 'isNextJs'>> = ({ locale, locales, content }) => {
    const { asPath } = useRouter();

    return (
        <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
                <NextLink href="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 21v-2.5M4 7l2 1M4 7l2-1M4 7v2.5M12 2.5V5m0 11.5a5.5 5.5 0 01-11 0 5.5 5.5 0 0111 0z" />
                    </svg>
                    <span>{content?.headerTitle || 'WebGL Hub'}</span>
                </NextLink>
            </div>
            <div className="flex items-center space-x-4 text-sm font-medium">
                {locales.map((loc, i) => (
                    <React.Fragment key={loc}>
                        {i > 0 && <span className="text-navy-600">|</span>}
                        <NextLink href={asPath} locale={loc} className={locale === loc ? 'text-teal-400' : 'text-navy-300 hover:text-teal-300 transition-colors'}>
                            {content?.languages[loc] || loc}
                        </NextLink>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

// This component uses react-router-dom and does not have i18n features
const ReactRouterHeaderContent: React.FC<Omit<HeaderProps, 'isNextJs' | 'locale' | 'locales'>> = ({ content }) => {
    return (
        <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
                <ReactRouterLink to="/" className="flex items-center space-x-2 text-2xl font-bold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 21v-2.5M4 7l2 1M4 7l2-1M4 7v2.5M12 2.5V5m0 11.5a5.5 5.5 0 01-11 0 5.5 5.5 0 0111 0z" />
                    </svg>
                    <span>{content?.headerTitle || 'WebGL Hub'}</span>
                </ReactRouterLink>
            </div>
            {/* No language switcher for the non-Next.js version */}
        </div>
    );
};

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header className="bg-navy-900/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-navy-950/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {props.isNextJs ? <NextJsHeaderContent {...props} /> : <ReactRouterHeaderContent {...props} />}
            </div>
        </header>
    );
};

export default Header;