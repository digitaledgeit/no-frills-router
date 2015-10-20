module.exports = function(router, match, title, content) {
  console.log(match);
  return '<html>' +
    '<head><title>'+title+' &mdash; no-frills-router</title></head>' +
    '<body>' +
    '<style>.link {margin-right: 0.5em;} .link--current {font-weight: bold} </style>' +
    '<nav>' +
    '<a class="link '+(match.name === 'home' ? 'link--current' : '')+'" href="'+router.assemble('home')+'">Index</a>' +
    '<a class="link '+(match.name === 'profile' ? 'link--current' : '')+'" href="'+router.assemble('profile', {username: 'jameslnewell'})+'">Profile</a>' +
    '</nav>' +
    '<h1>'+title+'</h1>'+
    content +
    '</body>'
  '</html>';
};