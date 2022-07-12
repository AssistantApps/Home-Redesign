const fs = require('fs');
const util = require('util');
const Handlebars = require('handlebars');

const pjson = require('../../package.json');

const dateHelper = require('../handlebar/helpers/date.helper.js');
const loudHelper = require('../handlebar/helpers/loud.helper.js');
const urlrefHelper = require('../handlebar/helpers/urlref.helper.js');
const versionHelper = require('../handlebar/helpers/version.helper.js');
const sectionClassHelper = require('../handlebar/helpers/sectionclass.helper.js');
const urlrefescapedHelper = require('../handlebar/helpers/urlrefescaped.helper.js');

const readFile = util.promisify(fs.readFile);

async function generateOtherFiles() {
    process.env['NODE_ENV'] = pjson.version;
    const projectDataContents = await readFile('./webpack/data/project.json', 'utf8');
    const projectData = JSON.parse(projectDataContents);

    Handlebars.registerHelper('date', dateHelper);
    Handlebars.registerHelper('loud', loudHelper);
    Handlebars.registerHelper('urlref', urlrefHelper);
    Handlebars.registerHelper('version', versionHelper);
    Handlebars.registerHelper('sectionclass', sectionClassHelper);
    Handlebars.registerHelper('urlrefescaped', urlrefescapedHelper);

    for (const assApp of projectData.assistantApps) {
        if (assApp.shortCode == null || assApp.shortCode.length < 2) continue;

        const template = await readFile(`./webpack/handlebar/app.hbs`, 'utf8');
        const templateFunc = Handlebars.compile(template);
        const templateData = {
            kurt: projectData.kurt,
            theme: projectData.theme,
            meta: projectData.meta,
            rootLinks: projectData.link,
            twitter: projectData.twitter,
            ...assApp
        };
        const compiledTemplate = templateFunc(templateData);

        if (!fs.existsSync(assApp.shortCode)) {
            fs.mkdirSync(assApp.shortCode);
        }
        fs.writeFile(`./${assApp.shortCode}/index.html`, compiledTemplate, ['utf8'], () => { });
    }

    for (const redirect of projectData.redirects) {
        const template = await readFile(`./webpack/handlebar/redirect.hbs`, 'utf8');
        const templateFunc = Handlebars.compile(template);
        const templateData = {
            title: redirect.pattern,
            url: redirect.url
        };
        const compiledTemplate = templateFunc(templateData);

        if (!fs.existsSync(redirect.pattern)) {
            fs.mkdirSync(redirect.pattern);
        }
        fs.writeFile(`./${redirect.pattern.toLowerCase()}/index.html`, compiledTemplate, ['utf8'], () => { });
        fs.writeFile(`./${redirect.pattern}/index.html`, compiledTemplate, ['utf8'], () => { });
    }
}

generateOtherFiles();
