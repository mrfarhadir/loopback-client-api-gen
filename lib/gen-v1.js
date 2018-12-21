/*eslint-disable*/
"use strict";
module.exports = function (API_BASE_URL, minify, filename, path) {
    const axios = require ('axios')
    const fs = require('fs')
    const beautify = require('js-beautify')
    const UglifyJS = require("uglify-es")
    axios.get(`${API_BASE_URL}/explorer/swagger.json`)
    .then( result => {
        let data = result.data
        let paths = data.paths

        let i = 0;
        let apiFileContent = `
        "use strict";
        import axios from 'axios'
        class Api {
            static url() {
                return '${API_BASE_URL}/api'
            }
            static replaceUrl(url,data) {
                var regex = new RegExp('{(' + Object.keys(data).join('|') + ')}', 'g');
                return url.replace(regex, (m, $1) => data[$1] || m);
            }
        `
        for (let path of Object.keys(paths)) {
            let methods = paths[path]
            i++
                let methodName  = path.substr(1).split('/').join('_')
                                                .split('{').join('_')
                                                .split('}').join('_')
                                                .split('-').join('_')
                apiFileContent += `
                ${methodName}(h=null) {
                    return {
                        h: h,
                        url: '${path}',                
                `;
                for( let method of Object.keys(methods)) {
                    //console.log(method)
                    let methodData = methods[method]
                    let params = ''
                    for(let p of methodData.parameters) {
                        if (p.name == 'credentials' ) p.name = 'data'
                        let comma = ''
                        if (params != '') comma = ', '
                        if (p.required) {
                            params += comma+p.name
                        }else {
                            params += comma+p.name+' = null'
                        }
                    }
                    apiFileContent+=` ${method}: function(${params}) {                    
                        return new Promise ((resolve,reject) => {
                            ${methodCode(method,methodData.parameters,methodName)}
                        })
                    }, `

                }
                apiFileContent+= `} 
                    }
                    
                `;
        }
        apiFileContent+= `
            } 
            export default Api
        `
        //ok create file name with given path
        let filePath = path+`${filename}.js`
        let filePathMinify = path+`${filename}.min.js`
        //make code pretty :)
        apiFileContent = beautify(apiFileContent, { indent_with_tabs: 1, space_in_empty_paren: false })
        fs.writeFileSync(filePath,apiFileContent)

        //lets minify apiFileContent :)
        if (minify == 'Yes') {
            apiFileContent = UglifyJS.minify(apiFileContent).code
            fs.writeFileSync(filePathMinify,apiFileContent)
        }
        console.log('\x1b[36m%s\x1b[0m', 'Generated, Enjoy :)');
    })
    .catch( err => {
        console.log('URL is not valid or loopback is not running !')
    })
    function replaceUrl(url, data) {
        var regex = new RegExp('{(' + Object.keys(data).join('|') + ')}', 'g');
        return url.replace(regex, (m, $1) => data[$1] || m);
    }
    function methodCode(method,parameters,methodName) {
        let code = ''

        let inPathParams = '';
        let inQueryParams = ``;
        for(let p of parameters) {
            if (p.in == 'path') {
                inPathParams+= `${p.name}: ${p.name} ,`
            }
            if (p.in == 'query') {
                inQueryParams+= `'${p.name}='+JSON.stringify(${p.name})`
            }
        }

        switch (method) {
            case 'get':
                code = `
                    let url = Api.url()+this.url
                    url = Api.replaceUrl(url,{
                        ${inPathParams}
                    })
                    `
                    if (inQueryParams != ``)
                        code += `url = url+'/?'+ ${inQueryParams}`

                code +=`
                    axios.get(url,{
                        headers: this.h 
                    })
                    .then(result => {
                        resolve(result.data)
                    })
                    .catch( error => {
                        reject(error)
                    })
                `    
            break;
            case 'post':
                code = `
                    let url = Api.url()+this.url
                    url = Api.replaceUrl(url,{
                        ${inPathParams}
                    })
                    axios.post(url,data,{
                        headers: this.h 
                    })
                    .then(result => {
                        resolve(result.data)
                    })
                    .catch( error => {
                        reject(error)
                    })
                ` 
            break;
            case 'delete':
                code = `
                    let url = Api.url()+this.url
                    url = Api.replaceUrl(url,{
                        ${inPathParams}
                    })
                    axios.delete(url,data,{
                        headers: this.h 
                    })
                    .then(result => {
                        resolve(result.data)
                    })
                    .catch( error => {
                        reject(error)
                    })
                `
            break
        }
        return code
    }

}