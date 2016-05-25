(function(module){
  var repos = {};

  repos.all - [];

  repos.requestRepos = function(callback) {
    $.get('github.users/jmalesh/repos' + '?per_page=15' + '&sort=updated')
    .done(function(data) {
      repos.all = data;
    }).done(callback);
  };

  repos.with = function(attr) {
    return repos.all.filter(function(repo) {
      return repo[attr];
    });
  };

  module.repos = repos;
})(window);
