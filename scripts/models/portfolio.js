(function(module) {
  function Project (opts) {
    Object.keys(opts).forEach(function(e, index, keys) {
      this[e] = opts[e];
    },this);
  }

  Project.all = [];

  Project.createTable = function(callback) {
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS projects (' +
        'id INTEGER PRIMARY KEY, ' +
        'title VARCHAR(255) NOT NULL, ' +
        'author VARCHAR(255) NOT NULL, ' +
        'authorUrl VARCHAR (255), ' +
        'category VARCHAR(20), ' +
        'publishedOn DATETIME, ' +
        'additionalNotes TEXT NOT NULL);',
      function(result) {
        console.log('Successfully set up the articles table.', result);
        if (callback) callback();
      }
    );
  };

  Project.truncateTable = function(callback) {
    webDB.execute(
      'DELETE FROM articles;',
      callback
    );
  };

  Project.prototype.deleteRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'DELETE FROM articles WHERE id = ?;',
          'data': [this.id]
        }
      ],
      callback
    );
  };

  Project.prototype.updateRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'UPDATE articles SET title = ?, author = ?, authorUrl = ?, category = ?, publishedOn = ?, body = ? WHERE id = ?;',
          'data': [this.title, this.author, this.authorUrl, this.category, this.publishedOn, this.body, this.id]
        }
      ],
      callback
    );
  };

  Project.loadAll = function(rows) {
    Project.all = rows.map(function(ele) {
      return new Project(ele);
    });
  };

  Project.fetchAll = function(next) {
    webDB.execute('SELECT * FROM articles ORDER BY publishedOn DESC', function(rows) {
      if (rows.length) {
        Project.loadAll(rows);
        next();
      } else {
        $.getJSON('/data/projects.json', function(rawData) {
          rawData.forEach(function(item) {
            var article = new Project(item);
            article.insertRecord(); // Cache the article in DB
          });
          webDB.execute('SELECT * FROM articles', function(rows) {
            Project.loadAll(rows);
            next();
          });
        });
      }
    });
  };

  Project.allProjects = function() {
    return Project.all.map(function(article) {
      return article.author;
    })
    .reduce(function(names, name) {
      if (names.indexOf(name) === -1) {
        names.push(name);
      }
      return names;
    }, []);
  };

  Project.prototype.insertRecord = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO articles (title, author, authorUrl, category, publishedOn, body) VALUES (?, ?, ?, ?, ?, ?);',
          'data': [this.title, this.author, this.authorUrl, this.category, this.publishedOn, this.body],
        }
      ],
      callback
    );
  };

  Project.prototype.toHtml = function() {
    var $source = $('#project-template').html();
    var template = Handlebars.compile($source);
    this.daysAgo = parseInt((new Date() - new Date(this.publishedOn)) / 60 / 60 / 24 / 1000);
    this.publishStatus = this.publishedOn ? 'published ' + this.daysAgo + ' days ago' : '(draft)';

    return template(this);
  };

  Project.prototype.popfilters = function() {
    var $source = $('#category-filter-template').html();
    var filter = Handlebars.compile($source);
    return filter(this);
  };

  // myNewData.sort(function(a,b) {
  //   return (new Date(b.publishedOn)) - (new Date(a.publishedOn));
  // });
  //
  // myNewData.forEach(function(ele) {
  //   projects.push(new Project(ele));
  // });

  // projects.forEach(function(a){
  //   $('#projects').append(a.toHtml());
  // });

  module.Project = Project;
})(window);
