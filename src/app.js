const fetch = require('cross-fetch');
const express = require('express');
const api = express();
const res = require('express/lib/response');

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo("13db61d1901677ec74116d88dfd38e7008e47991", "q4nYIMG3yLzZaEW+fUFyXstOz8/sxRtE1utA4Sstvdodf1yXSQinVyBDec4YubXhUdOho38oL43wjbyFBG8N4Yq6KIHDKuiCMD+dyHA4p1BKZKMAqb1YG8fztPXqjF0P", "3ef71a9e7a1c85ee2babc1248d4f9ff3");
let headers = {
    Authorization: 'bearer 3ef71a9e7a1c85ee2babc1248d4f9ff3' 
}

let search_api = 'https://api.themoviedb.org/3/search/movie?api_key=2f9f02831cd4959db526eb1dc6604395&language=en-US&query={search_here}&include_adult=false';
let vimeo_api = 'https://api.vimeo.com/videos?query={name}&page=1&per_page=1&sort=relevant';

api.listen(3000, () => {
    console.log('API is up and running');
})

api.get('/search_movies', (req, res) =>{
    let keys = Object.keys(req.query);
    for(let i = 0; i < keys.length; i++) {
        if(keys[i] !== 'name') {
            res.send('keys were not found');
            return 0;
        }
    } 
    let search = search_api.replace('{search_here}', req.query.name);
    fetch(search)
        .then(response => response.json())
        .then(mdb_data => {
            my_el = process_results(mdb_data)
            let counter = 0;
            let final_results = [];
            my_el.forEach(element => {
                let vimeo = vimeo_api.replace('{name}', element.title);
                fetch(vimeo, {method: "GET", headers: headers})
                .then(response => response.json())
                .then(vim_data => {
                    if(vim_data.data.length === 0) {
                        element.trailer = 'not found';
                        final_results.push(element);
                    } else {
                        element.trailer = vim_data.data[0].link;
                        final_results.push(element);
                    }
                    if(counter === 9) {        
                        res.send(final_results)
                    } 
                        counter++;
                })  
                //.then(() => console.log(element))
                
        })})})

function process_results(movie_list) {
    let results = [];
    for(let i = 0; i < 10; i++) {
        let el = {
            title: movie_list.results[i].title,
            overview: movie_list.results[i].overview,
            release_date: movie_list.results[i].release_date,
            trailer: ''
        }
        results.push(el);
    };
    return results;
}
