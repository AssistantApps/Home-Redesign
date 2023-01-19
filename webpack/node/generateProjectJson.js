const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);

const pjson = require('../../package.json');

async function generateFullJson() {
    process.env['NODE_ENV'] = pjson.version;

    const siteDataContents = await readFile('./webpack/data/site.json', 'utf8');
    const liveDataContents = await readFile('./webpack/data/live.json', 'utf8');

    const siteData = JSON.parse(siteDataContents);
    const liveData = JSON.parse(liveDataContents);

    const cspContents = await readFile('./webpack/data/csp.json', 'utf8');
    const cspContent = JSON.parse(cspContents);
    const headerList = cspContent.options.map(opt =>
        opt.name +
        ((opt.values != null && opt.values.length > 0) ? ' ' : '') +
        opt.values.join(' ')
    );
    const header = headerList.join('; ') + ';';

    const siteDataFull = {
        ...siteData,
        ...liveData,
        headers: [
            ...cspContent.headers.map(csp => ({ "name": csp, "value": header })),
            ...siteData.headers,
        ]
    };

    fs.writeFile(`./webpack/data/project.json`, JSON.stringify(siteDataFull), ['utf8'], () => { });
}


generateFullJson();
