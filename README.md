# Genome Explorer - SE Course Project

## Table of Contents

1. [Installation instructions](#1-installation-instructions)
2. [Building the application](#2-building-the-application)
3. [Third party dependencies](#3-third-party-dependencies)
4. [Application code](#4-application-code)

## 1. Installation instructions
Prerequisites:

- [Apache Maven](http://maven.apache.org/download.cgi) needs to be installed
- [Node.js](http://nodejs.org/download/) needs to be installed

Clone the repository or download the 
[zipball](http://github.com/rsschermer/genome-explorer/zipball/master). The
gene data is not included in the git repository and a RAR archive of the data
can be downloaded [here]().
Extract the archive into the root directory where you cloned/extracted the
repository. Assuming _mvn_ and _node_ were added to the PATH (the node installer
should add node to the path automatically, Maven needs to be added manually),
entering the following commands in terminal should start the servers:
    
	$ cd path/to/repository
	$ mvn jetty:run & node sequence_server.js

The application should now show up if you open a browser and go to
[localhost:9000/dist/](http://localhost:9000/dist/). The application was
developped mainly using Google Chrome for testing, but was briefly tested in the
latest Mozilla Firefox and Internet explorer 10 and should work properly in both
browsers.

## 2. Building the application
Instead of running the production files as described above, you can also build
from source in case you want to make any changes to the code.

Prerequisites:

- [Node.js](http://nodejs.org/download/) needs to be installed
- [Bower](http://bower.io) needs to be installed
- Grunt should be installed: `$ npm install -g grunt-cli`

Run the following commands in a terminal:

	$ cd path/to/repository
	$ npm install
	$ bower install

This should have downloaded all third party libraries. `$ grunt serve` will
start a server and open a browser using the raw source files. Data still needs
to be downloaded as described in the _installation_ section. The Jetty server
and sequence_server are also started in the same way as described in the
_installation_ section. `$ grunt build` should rebuild the application is the
`/dist` directory. If you are using the Jetty server to serve the static files
the icon images will be broken, because the application will be served from the
`/dist` instead of the root directory and I was unable to get the URL rewrite
rules working properly. This can be fixed with a "replace all" on the style
sheet: `/bower_components` --> `/dist/bower_components`.

## 3. Third party dependencies
The main top level production dependencies of the frontend javascript
application are:

- [AngularJS](http://angularjs.org) web application framework core
- [Restangular](https://github.com/mgonto/restangular) angular module for 
  interaction with a backend rest API
- [SASS Bootstrap](https://github.com/jlong/sass-bootstrap), the SASS version
  of the Twitter Bootstrap css framework
- [D3js](http://d3js.org/) data visualisation with svg images
- [Bootstrap Tour](http://bootstraptour.com/), feature tour of an application
  using Bootstrap's tooltips and popovers
- [Angular-Spinner](https://github.com/urish/angular-spinner), angular css 
  spinner directive used to indicate when something is loading
- [Glider](https://github.com/evrone/glider), angular slider directive

For a complete list of top level dependencies, have a look at the
[bower.json](/bower.json) file or install bower and run `$ bower install` as
described above which will install all production dependencies of the frontend
application into `/app/bower_components`.

The top level production dependencies of the node sequence_server are:

- [Express](http://expressjs.com/) node application framework
- [Lazy](https://github.com/pkrumins/node-lazy), allows using streams as lists
- [Pass-stream](https://github.com/jeffbski/pass-stream), transformation of
  stream data
- [PromisePipe](https://github.com/epeli/node-promisepipe), easier success or
  failure handling for stream piping

These dependencies are also listed in the [package.json](/package.json) file,
along with the development dependencies.

Finally, we used [Basex](http://basex.org/) both as the XML database containing 
the gene data and to build a rest API to communicate the data to the frontend
application using Basex's [restXQ](http://docs.basex.org/wiki/RESTXQ) module.
This module defines a set of annotations which can be used on xQuery function
declarations to link them to specific routes. These annotations are then
interpretted by the restXQ servlet. We used the 
[Basex Blog example](https://github.com/siserle/blog-example) as a starting
point.

## 4. Application code
An Angular application scaffold was generated using the
[Yeoman Angular generator](https://github.com/yeoman/generator-angular), which
provided us with a minimal skeleton application, including configuration files
for the [Grunt Taskrunner](http://gruntjs.com/), a standard 
[.htaccess](/app/.htaccess) Apache webserver configuration file and a standard
[404-page](/app/404.html). It was also used to generate Angular controller 
files, service files and directive files, which creates empty templates and
reduces time spend on writing boilerplate code. 
