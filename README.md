## Loop Back API Generator for Front-End
This Generator uses swagger API to generate JavaScript es6 classes for using Loop Back API Server.
### How to Install

    `npm install -g lb-api-gen`
    
or if you are using yarn

    `yarn add lb-api-gen global`
### How to Use It
First run your Loop Back API Server.

    `lb-api-gen`
Answer few questions and enjoy It :)

![loopback front-end api generator usage](https://i.postimg.cc/rwq6qLyh/lb-api-gen-sample.jpg)

and after generating, use It like this

![loop back front-end API generator usage](https://i.postimg.cc/5tLQMvPd/lb-api-gen-sample-2.jpg)

Each end point of model in Loop Back will be a method in this API class and for each method there is available HTTP request method.
If you need to modify request header, pass header as object to first method constructor.

### road map for HTTP methods:
 - [x] get
 - [x] post
 - [x] delete
 - [ ] put
 - [ ] patch
 - [ ] head

### road map for other feathers:

 - [ ] Select models to include
 - [ ] Select models to exclude
 - [ ] select fk type of methods

any question ?
[Ask It :)](http://mrfarhad.ir/#!/contact)

made with :heart: for you

