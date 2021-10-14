import { ParserPlugin, ParserPluginWithOptions } from '@babel/parser';

/**
 * Returns a list of babel parser plugin names
 * @param experimentalBabelParserPluginsList array of experimental babel parser plugins
 * @returns list of parser plugins to be passed to babel parser
 */
export const getExperimentalParserPlugins = (experimentalBabelParserPluginsList: string[]): ParserPlugin[] => {
    // Some experimental plugins have configurations so they are passed as JSON
    // in the form of ["plugin-name", { configuration: true }]
    return experimentalBabelParserPluginsList.map(pluginNameOrJson => {
        // ParserPlugin can be either a string or and array of [name: string, options: object]
        // in prettier options the array will be sent in a JSON string
        const isParserPluginWithOptions = pluginNameOrJson.startsWith("[");

        let plugin;
        if (isParserPluginWithOptions) {
            try {
                plugin = JSON.parse(pluginNameOrJson);
            } catch (e) {
                throw Error("Invalid JSON in experimentalBabelParserPluginsList: " + pluginNameOrJson);
            }
        } else {
            plugin = pluginNameOrJson;
        }

        return plugin;
    });
};
