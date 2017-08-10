'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const {resolve} = require('path')
const passport = require('passport')
const PrettyError = require('pretty-error')
const finalHandler = require('finalhandler')
// PrettyError docs: https://www.npmjs.com/package/pretty-error

// Bones has a symlink from node_modules/APP to the root of the app.
// That means that we can require paths relative to the app root by
// saying require('APP/whatever').
//
// This next line requires our root index.js:
const pkg = require('APP')

const app = express()

if (!pkg.isProduction && !pkg.isTesting) {
  // Logging middleware (dev only)
  app.use(require('volleyball'))
}

// Pretty error prints errors all pretty.
const prettyError = new PrettyError

// Skip events.js and http.js and similar core node files.
prettyError.skipNodeFiles()

// Skip all the trace lines about express' core and sub-modules.
prettyError.skipPackage('express')

module.exports = app
  // Session middleware - compared to express-session (which is what's used in the Auther workshop), cookie-session stores sessions in a cookie, rather than some other type of session store.
  // Cookie-session docs: https://www.npmjs.com/package/cookie-session
  .use(require('cookie-session')({
    name: 'session',
    keys: [process.env.SESSION_SECRET || 'an insecure secret key'],
  }))

  // Body parsing middleware
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())

  // Authentication middleware
  .use(passport.initialize())
  .use(passport.session())

  // Serve static files from ../public
  .use(express.static(resolve(__dirname, '..', 'bundle')))

  // Serve our api - ./api also requires in ../db, which syncs with our database
  .use('/api', require('./api'))

  // any requests with an extension (.js, .css, etc.) turn into 404
  .use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // Send index.html for anything else.
  .get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'public', 'index.html')))

  // Error middleware interceptor, delegates to same handler Express uses.
  // https://github.com/expressjs/express/blob/master/lib/application.js#L162
  // https://github.com/pillarjs/finalhandler/blob/master/index.js#L172
  .use((err, req, res, next) => {
    console.error(prettyError.render(err))
    finalHandler(req, res)(err)
  })

if (module === require.main) {
  // Start listening only if we're the main module.
  //
  // https://nodejs.org/api/modules.html#modules_accessing_the_main_module
  const server = app.listen(
    pkg.port,
    () => {
      console.log(`--- Started HTTP Server for ${pkg.name} ---`)
      const { address, port } = server.address()
      const host = address === '::' ? 'localhost' : address
      const urlSafeHost = host.includes(':') ? `[${host}]` : host
      console.log(`Listening on http://${urlSafeHost}:${port}`)
    }
  )
  // const PeerServer = require('peer').PeerServer
  const Topics = require('./connect/Topics.js')
  const io = require('socket.io').listen(server);

  console.log('io listening: ', io.sockets.sockets);

  io.sockets.on('connection', socket => {
    let room = '';
    const create = err => {
      if(err){
        return console.log('socket connection error: ', err);
      }
      socket.join(room);
      socket.emit('create');
    };
    socket.on('message', message => {console.log(200, message);
    socket.broadcast.to(room).emit('message', message)});
    socket.on('find', () => {
      const url = socket.request.headers.referer.split('/');
      console.log('referer', url);
      room = url[url.length - 1];
      const sr = io.sockets.adapter.rooms[room];
      if(sr === undefined) {
        socket.join(room);
        socket.emit(create);
      }else if (sr.length === 1) {
        socket.emit('join');
      }else {
        socket.emit('full', room);
      }
    })
    socket.on('auth', data => {
      data.sid = socket.id;
      socket.broadcast.to(room).emit('approve', data);
    })
    socket.on('accept', id => {
      io.sockets.connected[id].join(room);
      io.in(room).emit('bridge');
    })
    socket.on('reject', () => socket.emit('full'));
    socket.on('leave', () => {
      socket.broadcast.to(room).emit('hangup');
      socket.leave(room);
    })
  })
//   const peerServer = new PeerServer({ port: 9000, path: '/chat' });
//
// peerServer.on('connection', function (id) {
//   io.emit(Topics.USER_CONNECTED, id);
//   console.log('User connected with #', id);
// });
//
// peerServer.on('disconnect', function (id) {
//   io.emit(Topics.USER_DISCONNECTED, id);
//   console.log('User disconnected with #', id);
// });
}

// This check on line 64 is only starting the server if this file is being run directly by Node, and not required by another file.
// Bones does this for testing reasons. If we're running our app in development or production, we've run it directly from Node using 'npm start'.
// If we're testing, then we don't actually want to start the server; 'module === require.main' will luckily be false in that case, because we would be requiring in this file in our tests rather than running it directly.
