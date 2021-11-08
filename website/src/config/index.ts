import ConfigFile from './config.json';
export class Config {
    static URL_GITHUB = ConfigFile.URL_GITHUB;
    static URL_TWITTER = ConfigFile.URL_TWITTER;
    static URL_DISCORD = ConfigFile.URL_DISCORD;
    static URL_ANNOUNCEMETS = ConfigFile.URL_ANNOUNCEMETS;
    static URL_CLIENTS = ConfigFile.URL_CLIENTS;
    static URL_CLI = ConfigFile.URL_CLI;
    static URL_EXPLORER = ConfigFile.URL_EXPLORER;
    static URL_TESTNET = ConfigFile.URL_TESTNET;
    static URL_WALLET = ConfigFile.URL_WALLET;
    static URL_BOOTSTRAP = ConfigFile.URL_BOOTSTRAP;
    static URL_DOCS = ConfigFile.URL_DOCS;
    static URL_WHITEPAPER = ConfigFile.URL_WHITEPAPER;
    static menuItems = [
        {
            text: 'Token',
            path: '/#token'
        },
        {
            text: 'Tools',
            path: '/#tools'
        },
        {
            text: 'About',
            path: '/#about'
        },
    ];
}