import configFile from './config.json';
export { default as exchanges } from './exchanges.json';

export class Config {
    static URL_ANNOUNCEMETS =
        process.env.REACT_APP_URL_ANNOUNCEMETS ?? configFile.URL_ANNOUNCEMETS;
    static URL_MARKET_DATA =
        process.env.URL_MARKET_DATA ?? configFile.URL_MARKET_DATA;
    static URL_GITHUB =
        process.env.REACT_APP_URL_GITHUB ?? configFile.URL_GITHUB;
    static URL_DISCORD =
        process.env.REACT_APP_URL_DISCORD ?? configFile.URL_DISCORD;
    static URL_DOCS = process.env.REACT_APP_URL_DOCS ?? configFile.URL_DOCS;
    static URL_UNKNOWN1 =
        process.env.REACT_APP_URL_UNKNOWN1 ?? configFile.URL_UNKNOWN1;
}
