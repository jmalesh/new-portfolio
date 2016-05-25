(function(module) {

  var portfolioView = {};

  var render = function(project, projectTemplateId) {
    var template = Handlebars.compile($(projectTemplateId).text());

    project.daysAgo = parseInt((new Date() - new Date(article.publishedOn)) / 60 / 60 / 24 / 1000);
    project.publishStatus = article.publishedOn ? 'published ' + article.daysAgo + ' days ago' : '(draft)';
    project.body = marked(article.body);

    return template(project);
  };

  portfolioView.handleCategoryFilter = function() {
    $('#category-filter').on('change', function() {
      if($(this).val()) {
        $('#projects').hide();
        $('project[data-category="' + $(this).val() + '"]').fadeIn();
      } else {
        $('project').fadeIn();
        $('project.template').hide();
      }
    });
  };

  portfolioView.initNewPortfolioPage = function() {
    $('.tab-content').show();
    $('#exportfield').hide();
    $('#projects-json').on('focus', function() {
      this.select();
    });

    $('#new-form').on('change', 'input, textarea', projectView.create);
  };

  portfolioView.create = function() {
    var formProject;
    $('#projects').empty();

    formProject = new Project({
      title: $('#project-title').val(),
      author: $('#project-author').val(),
      authorUrl: $('#project-author-url').val(),
      category: $('#project-category').val(),
      body: $('#project-body').val(),
      publishedOn: $('#project-published:checked').length ? new Date() : null
    });

    $('#projects').append(render(formProject));
  };

  portfolioView.initIndexPage = function(){
    Project.all.forEach(function(a){
      if($('#category-filter option:contains("' + a.category + '")').length === 0) {
        $('#category-filter').append(render(a, '#category-filter-template'));
      };
      $('#projects').append(render(a, '#project-template'));
    });

    portfolioView.handleCategoryFilter();
  };

  module.portfolioView = portfolioView;

})(window);
