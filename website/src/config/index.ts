import ConfigFile from './config.json';

export class Config {
    static URL_ANNOUNCEMETS =
        process.env.REACT_APP_URL_ANNOUNCEMETS ?? ConfigFile.URL_ANNOUNCEMETS;
    static URL_GITHUB =
        process.env.REACT_APP_URL_GITHUB ?? ConfigFile.URL_GITHUB;
    static URL_DISCORD =
        process.env.REACT_APP_URL_DISCORD ?? ConfigFile.URL_DISCORD;
    static URL_DOCS = process.env.REACT_APP_URL_DOCS ?? ConfigFile.URL_DOCS;
    static URL_UNKNOWN1 =
        process.env.REACT_APP_URL_UNKNOWN1 ?? ConfigFile.URL_UNKNOWN1;
}
