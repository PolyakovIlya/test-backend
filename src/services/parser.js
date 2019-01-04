import request from 'request';
import cheerio from 'cheerio';

const init = (link) => {
    return new Promise(function(resolve, reject) {
        request.get(link, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
};

const parsePage = (data) => {
    const $ = cheerio.load(data);
    const header = $('article header .headline').text();

    let paragraphs = [];

    let body = $('article .row .body-copy');
    $(body).find('p').each((i, el) => {
        let obj = {
            paragraph: $(el).text()
        };
        paragraphs.push(obj);
    });

    return {header, paragraphs: [...paragraphs]};
};

export {init, parsePage}